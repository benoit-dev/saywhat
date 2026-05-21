import { useEffect, useRef, useState } from "react";
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
  const remove = useMutation(api.group.remove);
  const update = useMutation(api.group.update);

  const [newName, setNewName] = useState("");
  const [menuOpen, setMenuOpen] = useState<Id<"groupItems"> | null>(null);
  const [editing, setEditing] = useState<GroupItem | null>(null);
  const [deleting, setDeleting] = useState<GroupItem | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const onAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await add({ name, addedBy: user });
    setNewName("");
    toast(`${name} ajouté`);
  };

  const onConfirmDelete = async () => {
    if (!deleting) return;
    await remove({ id: deleting._id });
    toast(`${deleting.name} supprimé`);
    setDeleting(null);
  };

  return (
    <section className="view">
      <div className="view-title">Qui prend quoi</div>
      <div className="view-desc">Jeux, musique, ustensiles · clique pour t'assigner</div>
      <div>
        {items.map((g) => {
          const mine = g.assigned === user;
          return (
            <div className="group-item" key={g._id}>
              <div className="group-text">
                {g.name}
                {g.note && <small>{g.note}</small>}
              </div>
              {g.assigned ? (
                <button
                  className="assignee"
                  onClick={async () => {
                    const nextVal = mine ? null : user;
                    await setAssigned({ id: g._id, assigned: nextVal });
                    toast(nextVal ? `${g.name} → toi` : `${g.name} libéré`);
                  }}
                >
                  {g.assigned}
                </button>
              ) : (
                <button
                  className="group-cta"
                  onClick={async () => {
                    await setAssigned({ id: g._id, assigned: user });
                    toast(`${g.name} → toi`);
                  }}
                >
                  Je le prends
                </button>
              )}
              <div className="group-menu-wrap" ref={menuOpen === g._id ? menuRef : null}>
                <button
                  className="group-menu-btn"
                  aria-label="Options"
                  onClick={() =>
                    setMenuOpen((cur) => (cur === g._id ? null : g._id))
                  }
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
                {menuOpen === g._id && (
                  <div className="group-menu" role="menu">
                    <button
                      onClick={() => {
                        setEditing(g);
                        setMenuOpen(null);
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="danger"
                      onClick={() => {
                        setDeleting(g);
                        setMenuOpen(null);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (name, note) => {
            await update({ id: editing._id, name, note });
            toast(`${name} mis à jour`);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Supprimer cette entrée ?"
          body={deleting.name}
          confirmLabel="Supprimer"
          onCancel={() => setDeleting(null)}
          onConfirm={onConfirmDelete}
        />
      )}
    </section>
  );
}

function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: GroupItem;
  onClose: () => void;
  onSave: (name: string, note: string) => void | Promise<void>;
}) {
  const [name, setName] = useState(item.name);
  const [note, setNote] = useState(item.note ?? "");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async () => {
    const n = name.trim();
    if (!n) return;
    await onSave(n, note.trim());
  };

  return (
    <div
      className="copy-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="copy-modal-card edit-card">
        <div className="copy-modal-label">Modifier</div>
        <input
          ref={nameRef}
          className="edit-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <input
          className="edit-input"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optionnel)"
        />
        <div className="modal-actions">
          <button className="modal-btn ghost" onClick={onClose}>
            Annuler
          </button>
          <button className="modal-btn primary" onClick={onSubmit}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <div
      className="copy-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="copy-modal-card edit-card">
        <div className="copy-modal-label">{title}</div>
        <div className="confirm-body">{body}</div>
        <div className="modal-actions">
          <button className="modal-btn ghost" onClick={onCancel}>
            Annuler
          </button>
          <button className="modal-btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
