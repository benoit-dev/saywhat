import { mutation } from "./_generated/server";

/**
 * Seed initial data into the empty Convex deployment.
 * Run once after `npx convex dev` boots: `npx convex run seed:seedAll`.
 */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const out: Record<string, unknown> = {};

    // ---- group items
    const groupExisting = await ctx.db.query("groupItems").collect();
    if (groupExisting.length === 0) {
      const defaults = [
        { name: "Enceinte", note: "cuisine + dehors" },
        { name: "Trousse à pharmacie", note: "doliprane, pansements..." },
        { name: "Jeux de société", note: "à se répartir" },
        { name: "Jeux de cartes", note: "" },
        { name: "Plancha / accessoires BBQ", note: "pour vendredi soir" },
        { name: "Torchons + sopalin", note: "" },
        { name: "Sacs poubelles", note: "" },
        { name: "Glacière", note: "pour la route" },
      ];
      for (const item of defaults) {
        await ctx.db.insert("groupItems", item);
      }
      out.groupItems = defaults.length;
    } else {
      out.groupItems = "skipped";
    }

    // ---- cars
    const carsExisting = await ctx.db.query("cars").collect();
    if (carsExisting.length === 0) {
      const defaults = [
        { name: "Voiture Barbara", color: "terra", driver: "Barbara", pax: ["Lucie", "Andy"] },
        { name: "Voiture Auréluc", color: "forest", driver: "Luc", pax: ["Aurélie", "Benoît"] },
        {
          name: "Voiture André",
          color: "ochre",
          driver: "André-Sédou",
          pax: ["Maëva Jojo", "Arthur", "Émilie"],
        },
        { name: "Voiture Pierre", color: "terra", driver: "Pierre", pax: [] as string[] },
      ];
      for (const car of defaults) {
        await ctx.db.insert("cars", car);
      }
      out.cars = defaults.length;
    } else {
      out.cars = "skipped";
    }

    // ---- randos
    const randosExisting = await ctx.db.query("randos").collect();
    if (randosExisting.length === 0) {
      const defaults = [
        {
          name: "Chute-à-Bull",
          place: "Saint-Côme",
          distance: "15 min en voiture",
          difficulty: "facile",
          length: "~4 km",
          note: "Cascade impressionnante · escaliers · idéal en famille",
          rating: 4.7,
          url: "https://maps.google.com/?q=Chute-%C3%A0-Bull+Park+Saint-C%C3%B4me",
        },
        {
          name: "Sentier Swaggin",
          place: "Matawinie",
          distance: "20 min en voiture",
          difficulty: "difficile",
          length: "8 km · 3h",
          note: "Cascades multiples · 10$ parking · pas de réseau sur place",
          rating: 4.8,
          url: "https://maps.google.com/?q=Sentier+Swaggin+Sentier+National",
        },
        {
          name: "Sentier des Contreforts",
          place: "Notre-Dame-de-la-Merci",
          distance: "30 min en voiture",
          difficulty: "intermédiaire",
          length: "6 km boucle",
          note: "Belvédère superbe · bien balisé · accessible chiens en laisse",
          rating: 4.6,
          url: "https://maps.google.com/?q=Sentier+des+Contreforts+Notre-Dame-de-la-Merci",
        },
        {
          name: "Sentier Matawinie",
          place: "Sainte-Émélie-de-l'Énergie",
          distance: "25 min en voiture",
          difficulty: "facile à intermédiaire",
          length: "12 km A/R · 4h",
          note: "Gratuit · super points de vue · sentier national",
          rating: 4.6,
          url: "https://maps.google.com/?q=Sentier+Matawinie+Sentier+National",
        },
        {
          name: "Parc des Sept-Chutes",
          place: "Saint-Zénon",
          distance: "40 min en voiture",
          difficulty: "soutenu",
          length: "~6 km",
          note: "7 chutes · cardio assuré · le plus connu de la région",
          rating: 4.7,
          url: "https://maps.google.com/?q=Parc+r%C3%A9gional+des+Sept-Chutes",
        },
      ];
      for (const r of defaults) {
        await ctx.db.insert("randos", { ...r, votes: [] as string[] });
      }
      out.randos = defaults.length;
    } else {
      out.randos = "skipped";
    }

    // ---- polls
    const pollsExisting = await ctx.db.query("polls").collect();
    if (pollsExisting.length === 0) {
      const defaults = [
        {
          question: "Qui va dormir le moins ?",
          options: ["Benoît", "Arthur", "Bili", "André-Sédou", "Pierre", "autre"],
        },
        {
          question: "Première rando samedi : on part à quelle heure ?",
          options: [
            "8h, on est des warriors",
            "10h, raisonnable",
            "Après le brunch (13h)",
            "Direct au spa, oubliez la rando",
          ],
        },
        {
          question: "Le meilleur dish du WE va être :",
          options: [
            "Le BBQ vendredi",
            "Le brunch samedi",
            "Les fajitas samedi",
            "L'apéro du soir",
          ],
        },
      ];
      for (const p of defaults) {
        const id = `seed_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        await ctx.db.insert("polls", {
          question: p.question,
          author: "Flora",
          createdAt: Date.now(),
          options: p.options.map((t, i) => ({
            id: `${id}_o${i}`,
            text: t,
            voters: [] as string[],
          })),
        });
      }
      out.polls = defaults.length;
    } else {
      out.polls = "skipped";
    }

    return out;
  },
});
