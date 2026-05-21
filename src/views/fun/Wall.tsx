import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useUser } from "../../lib/user";
import { useToast } from "../../lib/toast";

type WallItem = {
  _id: Id<"wallItems">;
  text: string;
  attrib?: string;
  author: string;
  createdAt: number;
  likes: string[];
};

export function Wall() {
  const { user } = useUser();
  const toast = useToast();
  const items = (useQuery(api.wall.list) ?? []) as WallItem[];
  const add = useMutation(api.wall.add);
  const toggleLike = useMutation(api.wall.toggleLike);
  const remove = useMutation(api.wall.remove);

  const [text, setText] = useState("");
  const [attrib, setAttrib] = useState("");

  const onSubmit = async () => {
    const t = text.trim();
    if (!t) return;
    await add({ text: t, attrib: attrib.trim() || undefined, author: user });
    setText("");
    setAttrib("");
    toast("Citation ajoutée au wall");
  };

  return (
    <div className="fun-section">
      <div className="fun-section-head">
        <div className="fun-section-title">
          Le <em>wall</em>
        </div>
        <div className="fun-section-count">
          {items.length} citation{items.length > 1 ? "s" : ""}
        </div>
      </div>
      <div className="wall-add">
        <textarea
          placeholder="Une citation, un moment iconique, une phrase qu'on doit retenir..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="wall-add-bottom">
          <input
            className="wall-add-attrib"
            placeholder="dit·e par... (optionnel)"
            value={attrib}
            onChange={(e) => setAttrib(e.target.value)}
          />
          <button disabled={!text.trim()} onClick={onSubmit}>
            Poster
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px 12px",
            color: "var(--ink-mute)",
            fontSize: 13,
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Le wall est vide
          </div>
          Première citation à ajouter ?
        </div>
      ) : (
        items.map((item) => (
          <WallCard
            key={item._id}
            item={item}
            user={user}
            onLike={() => toggleLike({ id: item._id, user })}
            onRemove={() => remove({ id: item._id })}
          />
        ))
      )}
    </div>
  );
}

function WallCard({
  item,
  user,
  onLike,
  onRemove,
}: {
  item: WallItem;
  user: string;
  onLike: () => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const liked = item.likes.includes(user);

  return (
    <div className="wall-item">
      <div className="wall-item-text">{item.text}</div>
      <div className="wall-item-foot">
        <div>
          {item.attrib && <div className="wall-item-attrib">— {item.attrib}</div>}
          <div className="wall-item-author">posté par {item.author}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className={`wall-item-likes ${liked ? "liked" : ""}`} onClick={onLike}>
            ❤ {item.likes.length || ""}
          </button>
          {item.author === user && (
            <button
              className="wall-item-del"
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
            >
              {confirming ? "sûr·e ?" : "×"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
