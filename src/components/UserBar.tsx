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
    </div>
  );
}
