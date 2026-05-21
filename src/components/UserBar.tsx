import { PEOPLE } from "../data/constants";
import { useUser, type Person } from "../lib/user";
import { useToast } from "../lib/toast";

export function UserBar() {
  const { user, setUser } = useUser();
  const toast = useToast();

  return (
    <div className="user-bar">
      <div className="avatar">{user[0]}</div>
      <span>connecté·e en tant que</span>
      <strong className="user-bar-name">{user}</strong>
      <label className="user-bar-switch" aria-label="Changer d'utilisateur">
        <svg
          width="14"
          height="9"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <select
          value={user}
          onChange={(e) => {
            const next = e.target.value as Person;
            setUser(next);
            toast(`Salut ${next} 👋`);
          }}
        >
          {PEOPLE.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
