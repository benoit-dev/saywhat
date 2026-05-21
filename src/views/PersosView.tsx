import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PERSO_SECTIONS } from "../data/constants";
import { useUser } from "../lib/user";

export function PersosView() {
  const { user } = useUser();
  const list = useQuery(api.persos.listForUser, { user }) ?? [];
  const toggle = useMutation(api.persos.toggle);

  const doneSet = new Set(list.filter((p: { item: string; done: boolean }) => p.done).map((p: { item: string }) => p.item));

  return (
    <section className="view">
      <div className="view-title">Mes affaires</div>
      <div className="view-desc">Check-list privée · adaptée au chalet · printemps Québec</div>
      <div className="context-strip">
        <span className="ctx-chip">🌡 Nuits 5–8°</span>
        <span className="ctx-chip">🌧 Pluie dim</span>
        <span className="ctx-chip">🦟 Saison tiques</span>
        <span className="ctx-chip">♨ Spa probable</span>
      </div>
      <div>
        {PERSO_SECTIONS.map((sec) => (
          <div className="perso-section" key={sec.title}>
            <div className="perso-head">
              <span className="emoji">{sec.emoji}</span>
              {sec.title}
            </div>
            <div className="perso-grid">
              {sec.items.map((it) => {
                const done = doneSet.has(it);
                return (
                  <div
                    className={`perso-item ${done ? "done" : ""}`}
                    key={it}
                    onClick={() => toggle({ user, item: it })}
                  >
                    <div className="perso-mini-check">
                      <svg viewBox="0 0 24 24">
                        <polyline points="4 12 10 18 20 6" />
                      </svg>
                    </div>
                    <span>{it}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
