import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useUser } from "../lib/user";
import { useToast } from "../lib/toast";

type GroupItem = {
  _id: Id<"groupItems">;
  name: string;
  note?: string;
  assigned?: string;
};

export function GroupView() {
  const { user } = useUser();
  const toast = useToast();
  const items = (useQuery(api.group.list) ?? []) as GroupItem[];
  const setAssigned = useMutation(api.group.setAssigned);
  const add = useMutation(api.group.add);

  const [newName, setNewName] = useState("");

  const onAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await add({ name, addedBy: user });
    setNewName("");
    toast(`${name} ajouté`);
  };

  return (
    <section className="view">
      <div className="view-title">Qui prend quoi</div>
      <div className="view-desc">Jeux, musique, ustensiles · clique pour t'assigner</div>
      <div>
        {items.map((g) => (
          <div className="group-item" key={g._id}>
            <div className="group-text">
              {g.name}
              {g.note && <small>{g.note}</small>}
            </div>
            <button
              className={`assignee ${g.assigned ? "" : "empty"}`}
              onClick={async () => {
                const nextVal = g.assigned === user ? null : user;
                await setAssigned({ id: g._id, assigned: nextVal });
                toast(nextVal ? `${g.name} → toi` : `${g.name} libéré`);
              }}
            >
              {g.assigned || "+ je le prends"}
            </button>
          </div>
        ))}
      </div>
      <div className="add-course" style={{ marginTop: 14, marginBottom: 0 }}>
        <input
          className="add-input"
          placeholder="+ Ajouter quelque chose"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        <button className="add-btn" onClick={onAdd}>
          Add
        </button>
      </div>
    </section>
  );
}
