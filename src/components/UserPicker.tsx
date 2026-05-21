import { PEOPLE } from "../data/constants";
import type { Person } from "../lib/user";

export function UserPicker({ onPick }: { onPick: (p: Person) => void }) {
  return (
    <div className="user-picker">
      <div className="user-picker-eyebrow">SAYWHAT · CHALET 2026</div>
      <h1 className="user-picker-title">
        T'es <em>qui</em> dans l'histoire ?
      </h1>
      <div className="user-picker-sub">
        Pick ton nom pour qu'on sache qui fait quoi.
      </div>
      <div className="user-picker-grid">
        {PEOPLE.map((p) => (
          <button
            key={p}
            type="button"
            className="user-picker-card"
            onClick={() => onPick(p)}
          >
            <div className="user-picker-avatar">{p[0]}</div>
            <div className="user-picker-name">{p}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
