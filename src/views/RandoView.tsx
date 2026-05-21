import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DIFF_COLOR } from "../data/constants";
import { useUser } from "../lib/user";
import { useToast } from "../lib/toast";

type Rando = {
  _id: Id<"randos">;
  name: string;
  place: string;
  distance: string;
  difficulty: string;
  length: string;
  note: string;
  rating: number;
  url: string;
  votes: string[];
};

export function RandoView() {
  const { user } = useUser();
  const toast = useToast();
  const randos = (useQuery(api.randos.list) ?? []) as Rando[];
  const toggleVote = useMutation(api.randos.toggleVote);

  const sorted = [...randos].sort((a, b) => b.votes.length - a.votes.length);

  return (
    <section className="view">
      <div className="view-title">Les randos</div>
      <div className="view-desc">Sentiers à moins de 30 min · vote pour celle que tu veux faire</div>

      <div
        className="info-hero"
        style={{ background: "linear-gradient(135deg, var(--success), var(--joy-4))" }}
      >
        <div className="info-hero-label">🥾 Meilleure fenêtre rando</div>
        <div className="info-hero-value">
          Samedi 23
          <br />
          18°, sec, parfait
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {sorted.map((r) => {
          const voted = r.votes.includes(user);
          const diffCol = DIFF_COLOR[r.difficulty] ?? "light";
          return (
            <div className={`rando ${voted ? "voted" : ""}`} key={r._id}>
              <div className="rando-head">
                <div>
                  <div className="rando-name">{r.name}</div>
                  <div className="rando-place">
                    {r.place} · {r.distance}
                  </div>
                </div>
                <div className="rando-rating">★ {r.rating}</div>
              </div>
              <div className="rando-meta">
                <span className="rando-tag" data-c={diffCol}>
                  {r.difficulty}
                </span>
                <span className="rando-tag light">{r.length}</span>
              </div>
              <div className="rando-note">{r.note}</div>
              <div className="rando-actions">
                <button
                  className={`vote-btn ${voted ? "voted" : ""}`}
                  onClick={async () => {
                    await toggleVote({ id: r._id, user });
                    toast(voted ? "Vote retiré" : `Tu votes pour ${r.name}`);
                  }}
                >
                  {voted ? "✓ tu votes" : "+ je suis partant·e"}
                  {r.votes.length > 0 && <span className="vote-count">{r.votes.length}</span>}
                </button>
                <a href={r.url} target="_blank" rel="noreferrer" className="rando-link">
                  Maps →
                </a>
              </div>
              {r.votes.length > 0 && <div className="voters">{r.votes.join(" · ")}</div>}
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="empty">
            <div className="empty-title">Pas encore de randos</div>
            <div className="empty-text">Les seeds vont arriver au prochain lancement du backend.</div>
          </div>
        )}
      </div>
    </section>
  );
}
