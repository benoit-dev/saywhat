export const PEOPLE = [
  "Flora",
  "Benoît",
  "Barbara",
  "André-Sédou",
  "Andy",
  "Arthur",
  "Aurélie",
  "Bili",
  "Émilie",
  "Kévin",
  "Luc",
  "Lucie",
  "Maëva Jojo",
  "Maëva Va",
  "Pierre",
] as const;

export const PAX_TOTAL = 15;
export const PAX_VG = 2;
export const PAX_OMNI = PAX_TOTAL - PAX_VG;

// Révélation : dimanche 24 mai 2026 à 12h00
export const REVEAL_TIME = new Date("2026-05-24T12:00:00").getTime();

export const CAT_EMOJI: Record<string, string> = {
  "Fruits & légumes": "🥬",
  "Frais": "🧀",
  "Viandes": "🥩",
  "Surgelés": "🧊",
  "Épicerie": "🛒",
  "Alcool": "🍷",
  "Softs": "🥤",
  "De la maison": "🏠",
};

export const CAT_ORDER = [
  "Fruits & légumes",
  "Frais",
  "Viandes",
  "Surgelés",
  "Épicerie",
  "Alcool",
  "Softs",
  "De la maison",
] as const;

export type CourseCategory = (typeof CAT_ORDER)[number];

export type Ingredient = {
  name: string;
  qty: number;
  per: "all" | "omni" | "vg" | "fixed";
  unit: string;
  cat: CourseCategory;
  round?: "ceil";
};

export type Recipe = {
  title: string;
  items?: string;
  vg?: boolean;
  hidden?: boolean;
  ingredients: Ingredient[];
};

export const RECIPES: Record<string, Recipe> = {
  apero_ven: {
    title: "Apéro d'arrivée",
    items: "Chips, houmous, crudités, planche, bières & vin",
    vg: true,
    ingredients: [
      { name: "Chips/tortilla chips", qty: 0.3, per: "all", unit: "sachet", cat: "Épicerie", round: "ceil" },
      { name: "Houmous", qty: 0.15, per: "all", unit: "pot", cat: "Frais", round: "ceil" },
      { name: "Guacamole", qty: 0.12, per: "all", unit: "pot", cat: "Frais", round: "ceil" },
      { name: "Carottes", qty: 50, per: "all", unit: "g", cat: "Fruits & légumes" },
      { name: "Concombre", qty: 0.2, per: "all", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Radis (botte)", qty: 0.15, per: "all", unit: "botte", cat: "Fruits & légumes", round: "ceil" },
      { name: "Olives", qty: 30, per: "all", unit: "g", cat: "Épicerie" },
      { name: "Saucisson", qty: 40, per: "omni", unit: "g", cat: "Viandes" },
      { name: "Fromage à apéro", qty: 50, per: "all", unit: "g", cat: "Frais" },
      { name: "Crackers / pain apéro", qty: 0.25, per: "all", unit: "paquet", cat: "Épicerie", round: "ceil" },
    ],
  },
  bbq_ven: {
    title: "BBQ",
    items: "Viandes grillées + halloumi/légumes pour les VG · salades · pain",
    vg: true,
    ingredients: [
      { name: "Poulet mariné", qty: 150, per: "omni", unit: "g", cat: "Viandes" },
      { name: "Saucisses BBQ", qty: 1.5, per: "omni", unit: "pièce", cat: "Viandes", round: "ceil" },
      { name: "Steaks hachés", qty: 1, per: "omni", unit: "pièce", cat: "Viandes", round: "ceil" },
      { name: "Halloumi (pavé)", qty: 150, per: "vg", unit: "g", cat: "Frais" },
      { name: "Courgettes (brochettes)", qty: 1, per: "vg", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Poivrons (brochettes VG)", qty: 1, per: "vg", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Champignons", qty: 100, per: "vg", unit: "g", cat: "Fruits & légumes" },
      { name: "Salade verte (sachet)", qty: 0.2, per: "all", unit: "sachet", cat: "Fruits & légumes", round: "ceil" },
      { name: "Tomates cerises", qty: 30, per: "all", unit: "g", cat: "Fruits & légumes" },
      { name: "Pâtes (salade froide)", qty: 70, per: "all", unit: "g", cat: "Épicerie" },
      { name: "Pain (baguette)", qty: 0.2, per: "all", unit: "baguette", cat: "Épicerie", round: "ceil" },
      { name: "Sauce BBQ", qty: 1, per: "fixed", unit: "bouteille", cat: "Épicerie" },
      { name: "Moutarde", qty: 1, per: "fixed", unit: "pot", cat: "Épicerie" },
      { name: "Ketchup", qty: 1, per: "fixed", unit: "bouteille", cat: "Épicerie" },
      { name: "Mayonnaise", qty: 1, per: "fixed", unit: "pot", cat: "Épicerie" },
      { name: "Huile d'olive", qty: 1, per: "fixed", unit: "bouteille", cat: "Épicerie" },
      { name: "Charbon BBQ", qty: 1, per: "fixed", unit: "sac", cat: "Épicerie" },
    ],
  },
  brunch_sam: {
    title: "Gros brunch",
    items: "Œufs, bacon, fruits, viennoiseries, saumon fumé (VG)",
    vg: true,
    ingredients: [
      { name: "Œufs", qty: 2, per: "all", unit: "pièce", cat: "Frais", round: "ceil" },
      { name: "Bacon", qty: 80, per: "omni", unit: "g", cat: "Viandes" },
      { name: "Saumon fumé", qty: 50, per: "all", unit: "g", cat: "Frais" },
      { name: "Pain de mie", qty: 2, per: "all", unit: "tranche", cat: "Épicerie", round: "ceil" },
      { name: "Viennoiseries", qty: 1.2, per: "all", unit: "pièce", cat: "Épicerie", round: "ceil" },
      { name: "Fruits frais", qty: 200, per: "all", unit: "g", cat: "Fruits & légumes" },
      { name: "Fruits rouges (barquette)", qty: 0.2, per: "all", unit: "barquette", cat: "Fruits & légumes", round: "ceil" },
      { name: "Beurre", qty: 25, per: "all", unit: "g", cat: "Frais" },
      { name: "Confiture", qty: 1, per: "fixed", unit: "pot", cat: "Épicerie" },
      { name: "Lait", qty: 200, per: "all", unit: "ml", cat: "Frais" },
      { name: "Café (paquet moulu)", qty: 1, per: "fixed", unit: "paquet", cat: "Épicerie" },
      { name: "Thé (boîte sachets)", qty: 1, per: "fixed", unit: "boîte", cat: "Épicerie" },
      { name: "Jus d'orange", qty: 200, per: "all", unit: "ml", cat: "Softs" },
      { name: "Sirop d'érable", qty: 1, per: "fixed", unit: "bouteille", cat: "Épicerie" },
      { name: "Crème fraîche", qty: 1, per: "fixed", unit: "pot", cat: "Frais" },
    ],
  },
  apero_sam: {
    title: "Apéro du soir",
    items: "Planche fromages & charcuterie, dips, crackers",
    vg: true,
    ingredients: [
      { name: "Planche fromages (3 sortes)", qty: 60, per: "all", unit: "g", cat: "Frais" },
      { name: "Charcuterie (jambon, saucisson)", qty: 50, per: "omni", unit: "g", cat: "Viandes" },
      { name: "Crackers / gressins", qty: 0.25, per: "all", unit: "paquet", cat: "Épicerie", round: "ceil" },
      { name: "Tapenade / caviar aubergine", qty: 0.1, per: "all", unit: "pot", cat: "Frais", round: "ceil" },
      { name: "Noix mélangées", qty: 30, per: "all", unit: "g", cat: "Épicerie" },
      { name: "Raisins", qty: 50, per: "all", unit: "g", cat: "Fruits & légumes" },
      { name: "Cornichons", qty: 1, per: "fixed", unit: "pot", cat: "Épicerie" },
    ],
  },
  fajitas_sam: {
    title: "Fajitas",
    items: "Poulet (option champignons/tofu pour VG) · tortillas · garnitures",
    vg: true,
    ingredients: [
      { name: "Poulet (escalopes)", qty: 180, per: "omni", unit: "g", cat: "Viandes" },
      { name: "Champignons", qty: 200, per: "vg", unit: "g", cat: "Fruits & légumes" },
      { name: "Tofu ferme (VG)", qty: 100, per: "vg", unit: "g", cat: "Frais" },
      { name: "Tortillas (paquet)", qty: 0.25, per: "all", unit: "paquet", cat: "Épicerie", round: "ceil" },
      { name: "Poivrons rouges/jaunes", qty: 0.4, per: "all", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Oignons", qty: 0.3, per: "all", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Ail (tête)", qty: 1, per: "fixed", unit: "tête", cat: "Fruits & légumes" },
      { name: "Avocats (guac)", qty: 0.4, per: "all", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Citrons verts", qty: 0.2, per: "all", unit: "pièce", cat: "Fruits & légumes", round: "ceil" },
      { name: "Coriandre (botte)", qty: 1, per: "fixed", unit: "botte", cat: "Fruits & légumes" },
      { name: "Salsa", qty: 1, per: "fixed", unit: "pot", cat: "Épicerie" },
      { name: "Crème sure", qty: 1, per: "fixed", unit: "pot", cat: "Frais" },
      { name: "Fromage râpé", qty: 40, per: "all", unit: "g", cat: "Frais" },
      { name: "Épices fajitas", qty: 1, per: "fixed", unit: "sachet", cat: "Épicerie" },
    ],
  },
  brunch_dim: {
    title: "Brunch light",
    items: "Restes du weekend · quelques compléments",
    vg: true,
    ingredients: [
      { name: "Œufs (en plus si besoin)", qty: 1, per: "all", unit: "pièce", cat: "Frais", round: "ceil" },
      { name: "Pain (baguette)", qty: 0.15, per: "all", unit: "baguette", cat: "Épicerie", round: "ceil" },
      { name: "Yaourts", qty: 1, per: "all", unit: "pièce", cat: "Frais", round: "ceil" },
    ],
  },
  boissons_weekend: {
    title: "Boissons du weekend",
    hidden: true,
    ingredients: [
      { name: "Bières", qty: 4, per: "all", unit: "canette", cat: "Alcool", round: "ceil" },
      { name: "Vin rouge", qty: 0.25, per: "all", unit: "bouteille", cat: "Alcool", round: "ceil" },
      { name: "Vin blanc", qty: 0.2, per: "all", unit: "bouteille", cat: "Alcool", round: "ceil" },
      { name: "Vin rosé", qty: 0.15, per: "all", unit: "bouteille", cat: "Alcool", round: "ceil" },
      { name: "Eau pétillante", qty: 0.3, per: "all", unit: "bouteille 1.5L", cat: "Softs", round: "ceil" },
      { name: "Eau plate", qty: 0.5, per: "all", unit: "bouteille 1.5L", cat: "Softs", round: "ceil" },
      { name: "Coca / soft", qty: 0.25, per: "all", unit: "bouteille 1.5L", cat: "Softs", round: "ceil" },
      { name: "Jus de fruits", qty: 0.15, per: "all", unit: "bouteille 1L", cat: "Softs", round: "ceil" },
      { name: "Glaçons (sac)", qty: 1, per: "fixed", unit: "sac", cat: "Surgelés" },
    ],
  },
  base_chalet: {
    title: "Indispensables chalet",
    hidden: true,
    ingredients: [
      { name: "Sel", qty: 1, per: "fixed", unit: "paquet", cat: "De la maison" },
      { name: "Poivre", qty: 1, per: "fixed", unit: "pot", cat: "De la maison" },
      { name: "Papier essuie-tout", qty: 2, per: "fixed", unit: "rouleau", cat: "De la maison" },
      { name: "Sopalin / serviettes", qty: 1, per: "fixed", unit: "paquet", cat: "De la maison" },
      { name: "Papier alu", qty: 1, per: "fixed", unit: "rouleau", cat: "De la maison" },
      { name: "Film plastique", qty: 1, per: "fixed", unit: "rouleau", cat: "De la maison" },
    ],
  },
};

export type DayMeals = { day: string; date: string; meals: Record<string, string> };

export const MEALS: DayMeals[] = [
  { day: "Vendredi", date: "22", meals: { "Apéro": "apero_ven", "Diner": "bbq_ven" } },
  {
    day: "Samedi",
    date: "23",
    meals: { "Brunch": "brunch_sam", "Apéro": "apero_sam", "Diner": "fajitas_sam" },
  },
  { day: "Dimanche", date: "24", meals: { "Brunch": "brunch_dim" } },
];

export const DEFAULT_GROUP = [
  { name: "Enceinte", note: "cuisine + dehors" },
  { name: "Trousse à pharmacie", note: "doliprane, pansements..." },
  { name: "Jeux de société", note: "à se répartir" },
  { name: "Jeux de cartes", note: "" },
  { name: "Plancha / accessoires BBQ", note: "pour vendredi soir" },
  { name: "Torchons + sopalin", note: "" },
  { name: "Sacs poubelles", note: "" },
  { name: "Glacière", note: "pour la route" },
];

export const DEFAULT_CARS = [
  { name: "Voiture Barbara", color: "terra", driver: "Barbara", pax: ["Lucie", "Andy"] },
  { name: "Voiture Auréluc", color: "forest", driver: "Luc", pax: ["Aurélie", "Benoît"] },
  {
    name: "Voiture André",
    color: "ochre",
    driver: "André-Sédou",
    pax: ["Maëva Jojo", "Arthur", "Émilie"],
  },
  { name: "Voiture Pierre", color: "terra", driver: "Pierre", pax: [] },
];

export const PERSO_SECTIONS = [
  {
    emoji: "🧥",
    title: "Vêtements",
    items: [
      "Pull / hoodie chaud",
      "K-way / coupe-vent",
      "Pantalon long",
      "T-shirts",
      "Chaussettes",
      "Sous-vêtements",
      "Tenue confort intérieur",
    ],
  },
  {
    emoji: "🥾",
    title: "Rando & extérieur",
    items: [
      "Chaussures de marche",
      "Sac à dos petit",
      "Gourde",
      "Spray anti-tiques + moustiques",
      "Crème solaire",
      "Lunettes de soleil",
    ],
  },
  {
    emoji: "♨",
    title: "Spa & détente",
    items: ["Maillot de bain", "Serviette", "Tongs / sandales"],
  },
  {
    emoji: "🧴",
    title: "Hygiène",
    items: [
      "Brosse à dents + dentifrice",
      "Démaquillant / soins",
      "Déodorant",
      "Médocs perso",
      "Protections hygiéniques",
    ],
  },
  {
    emoji: "🔌",
    title: "Électronique",
    items: [
      "Chargeur téléphone",
      "Jack-to-jack voiture",
      "Adaptateur québécois (CA <> EU)",
    ],
  },
];

export const DEFAULT_RANDOS = [
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

export const DEFAULT_POLLS = [
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

export const DIFF_COLOR: Record<string, string> = {
  facile: "forest",
  "facile à intermédiaire": "forest",
  intermédiaire: "ochre",
  soutenu: "terra",
  difficile: "terra",
};

export const ACCESS_CODE = "pixie";
