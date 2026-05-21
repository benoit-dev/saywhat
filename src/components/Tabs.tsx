export type TabId =
  | "infos"
  | "repas"
  | "courses"
  | "persos"
  | "rando"
  | "group"
  | "cars"
  | "fun";

const TABS: { id: TabId; label: string }[] = [
  { id: "infos", label: "Infos" },
  { id: "repas", label: "Repas" },
  { id: "courses", label: "Courses" },
  { id: "persos", label: "Mes affaires" },
  { id: "rando", label: "Rando" },
  { id: "group", label: "Qui prend quoi" },
  { id: "cars", label: "Voitures" },
  { id: "fun", label: "✨ Fun" },
];

export function Tabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav className="tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? "active" : ""}`}
          onClick={() => {
            onChange(t.id);
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          }}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
