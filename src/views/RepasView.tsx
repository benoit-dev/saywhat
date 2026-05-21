import { useState } from "react";
import { MEALS, RECIPES } from "../data/constants";
import { calcQty, formatQty } from "../data/courses";

export function RepasView() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="view">
      <div className="view-title">Le menu</div>
      <div className="view-desc">
        Tape sur un repas pour voir le détail des ingrédients · les courses se calculent automatiquement
      </div>

      <div>
        {MEALS.map((d, di) => (
          <div className="meal-card" key={di}>
            <div className="meal-card-head">
              <div className="meal-day-num">{d.date}</div>
              <div className="meal-day-text">
                <div className="meal-day-name">{d.day}</div>
                <div className="meal-day-sub">mai 2026</div>
              </div>
            </div>
            {Object.entries(d.meals).map(([slot, key]) => {
              const recipe = RECIPES[key];
              if (!recipe) return null;
              const id = `${di}-${slot}`;
              const isOpen = open === id;
              return (
                <div
                  className={`meal-row ${isOpen ? "open" : ""}`}
                  key={slot}
                  onClick={() => setOpen(isOpen ? null : id)}
                >
                  <div className="meal-row-top">
                    <div className="meal-slot">{slot}</div>
                    <div className="meal-info">
                      <div className="meal-title">
                        {recipe.title}
                        {recipe.vg && <span className="tag-vg">VG</span>}
                      </div>
                      <div className="meal-summary">{recipe.items}</div>
                    </div>
                    <div className="meal-toggle">⌄</div>
                  </div>
                  <div className="meal-recipe">
                    <div className="meal-recipe-head">
                      Pour 15 personnes · {recipe.ingredients.length} ingrédients
                    </div>
                    <div className="meal-recipe-list">
                      {recipe.ingredients.map((ing, i) => {
                        const q = calcQty(ing);
                        const f = formatQty(q, ing.unit);
                        return (
                          <div className="meal-recipe-item" key={i}>
                            <div className="meal-recipe-qty">
                              {f.num} {f.unit}
                            </div>
                            <div>{ing.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
