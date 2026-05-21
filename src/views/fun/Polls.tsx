import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useUser } from "../../lib/user";
import { useToast } from "../../lib/toast";

type Poll = {
  _id: Id<"polls">;
  question: string;
  options: { id: string; text: string; voters: string[] }[];
  author: string;
  createdAt: number;
};

export function Polls() {
  const { user } = useUser();
  const toast = useToast();
  const polls = (useQuery(api.polls.list) ?? []) as Poll[];
  const vote = useMutation(api.polls.vote);
  const create = useMutation(api.polls.create);
  const remove = useMutation(api.polls.remove);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState<string[]>(["", ""]);

  const reset = () => {
    setQ("");
    setOpts(["", ""]);
    setOpen(false);
  };

  const onCreate = async () => {
    const question = q.trim();
    const options = opts.map((o) => o.trim()).filter(Boolean);
    if (!question || options.length < 2) {
      toast("Il faut une question et au moins 2 options");
      return;
    }
    await create({ question, options, author: user });
    reset();
    toast("Sondage créé");
  };

  return (
    <div className="fun-section">
      <div className="fun-section-head">
        <div className="fun-section-title">
          Les <em>sondages</em>
        </div>
        <div className="fun-section-count">{polls.length} actifs</div>
      </div>

      <div className={`add-poll ${open ? "" : "collapsed"}`}>
        {!open && (
          <button className="add-poll-toggle" onClick={() => setOpen(true)}>
            + proposer un sondage
          </button>
        )}
        {open && (
          <div className="add-poll-body" style={{ marginTop: 0 }}>
            <input
              className="add-poll-q"
              autoFocus
              placeholder="Ta question..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div>
              {opts.map((o, i) => (
                <div className="add-poll-opt" key={i}>
                  <input
                    placeholder={`option ${i + 1}`}
                    value={o}
                    onChange={(e) => {
                      const next = [...opts];
                      next[i] = e.target.value;
                      setOpts(next);
                    }}
                  />
                  {opts.length > 2 && (
                    <button onClick={() => setOpts(opts.filter((_, j) => j !== i))}>×</button>
                  )}
                </div>
              ))}
            </div>
            <button
              className="add-poll-toggle"
              style={{ marginTop: 4 }}
              onClick={() => setOpts([...opts, ""])}
            >
              + ajouter une option
            </button>
            <div className="add-poll-actions">
              <button className="secondary" onClick={reset}>
                Annuler
              </button>
              <button onClick={onCreate}>Créer</button>
            </div>
          </div>
        )}
      </div>

      {polls.map((poll) => (
        <PollCard
          key={poll._id}
          poll={poll}
          user={user}
          onVote={(optionId) => vote({ id: poll._id, optionId, user })}
          onRemove={() => remove({ id: poll._id })}
        />
      ))}
    </div>
  );
}

function PollCard({
  poll,
  user,
  onVote,
  onRemove,
}: {
  poll: Poll;
  user: string;
  onVote: (optionId: string) => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const totalVotes = poll.options.reduce((s, o) => s + o.voters.length, 0);

  return (
    <div className="poll">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div className="poll-q">{poll.question}</div>
          <div className="poll-meta">
            par {poll.author} · {totalVotes} vote{totalVotes > 1 ? "s" : ""}
          </div>
        </div>
        {poll.author === user && (
          <button
            className="poll-del"
            style={{ color: confirming ? "var(--primary)" : undefined }}
            onClick={() => {
              if (confirming) {
                onRemove();
                setConfirming(false);
              } else {
                setConfirming(true);
                setTimeout(() => setConfirming(false), 3000);
              }
            }}
            title="supprimer"
          >
            {confirming ? "sûr·e ?" : "×"}
          </button>
        )}
      </div>
      <div className="poll-options">
        {poll.options.map((opt) => {
          const voted = opt.voters.includes(user);
          const pct = totalVotes ? Math.round((opt.voters.length / totalVotes) * 100) : 0;
          const scale = totalVotes ? opt.voters.length / totalVotes : 0;
          return (
            <div
              key={opt.id}
              className={`poll-option ${voted ? "voted" : ""}`}
              onClick={() => onVote(opt.id)}
            >
              <div className="poll-option-bar" style={{ transform: `scaleX(${scale})` }} />
              <div className="poll-option-content">
                <div className="poll-option-text">{opt.text}</div>
                <div className="poll-option-pct">{totalVotes ? `${pct}%` : ""}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
