import {
  CAT_ORDER,
  MEALS,
  PAX_OMNI,
  PAX_TOTAL,
  PAX_VG,
  RECIPES,
  type Ingredient,
} from "./constants";

export function calcQty(ing: Ingredient): number {
  let q: number;
  if (ing.per === "omni") q = ing.qty * PAX_OMNI;
  else if (ing.per === "vg") q = ing.qty * PAX_VG;
  else if (ing.per === "all") q = ing.qty * PAX_TOTAL;
  else q = ing.qty;
  if (ing.round === "ceil") q = Math.ceil(q);
  else if (ing.unit === "g" || ing.unit === "ml") q = Math.round(q / 10) * 10;
  else q = Math.round(q * 10) / 10;
  return q;
}

export function formatQty(q: number | string, unit: string): { num: string; unit: string } {
  const n = typeof q === "string" ? parseFloat(q) : q;
  if (unit === "g" && n >= 1000)
    return { num: (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1), unit: "kg" };
  if (unit === "ml" && n >= 1000)
    return { num: (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1), unit: "L" };
  let u = unit;
  if (n > 1 && !["g", "kg", "ml", "L"].includes(unit) && !unit.endsWith("s")) {
    u = unit + "s";
  }
  return { num: String(n), unit: u };
}

export type AutoCourse = {
  id: string;
  auto: true;
  name: string;
  cat: string;
  qtyNum: string;
  qtyUnit: string;
  sources: string[];
};

const ALWAYS_INCLUDE = ["boissons_weekend", "base_chalet"];

export function getUsedRecipeKeys(): string[] {
  const keys: string[] = [];
  MEALS.forEach((d) => Object.values(d.meals).forEach((k) => k && keys.push(k)));
  return keys;
}

export function generateCoursesFromRecipes(
  usedRecipeKeys: string[],
  alwaysInclude: string[] = ALWAYS_INCLUDE
): AutoCourse[] {
  type Agg = {
    name: string;
    cat: string;
    unit: string;
    qty: number;
    sources: string[];
  };
  const agg = new Map<string, Agg>();
  const allKeys = Array.from(new Set([...usedRecipeKeys, ...alwaysInclude]));
  allKeys.forEach((key) => {
    const r = RECIPES[key];
    if (!r) return;
    r.ingredients.forEach((ing) => {
      const k = `${ing.name}|${ing.cat}|${ing.unit}`;
      const q = calcQty(ing);
      const existing = agg.get(k);
      if (existing) {
        existing.qty += q;
        if (!existing.sources.includes(r.title)) existing.sources.push(r.title);
      } else {
        agg.set(k, {
          name: ing.name,
          cat: ing.cat,
          unit: ing.unit,
          qty: q,
          sources: [r.title],
        });
      }
    });
  });
  return Array.from(agg.values()).map((e, i): AutoCourse => {
    let q = e.qty;
    if (e.unit === "g" || e.unit === "ml") q = Math.round(q / 50) * 50;
    const f = formatQty(q, e.unit);
    return {
      id: `auto_${i}_${e.name}`,
      auto: true,
      name: e.name,
      cat: e.cat,
      qtyNum: f.num,
      qtyUnit: f.unit,
      sources: e.sources,
    };
  });
}

// Stable id mapping based on name+cat+unit (not index), so seeds restay aligned across regen.
export function makeAutoCourses(): AutoCourse[] {
  return generateCoursesFromRecipes(getUsedRecipeKeys());
}

export { CAT_ORDER };
