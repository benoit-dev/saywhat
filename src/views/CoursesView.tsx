import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CAT_EMOJI, CAT_ORDER } from "../data/constants";
import { makeAutoCourses, type AutoCourse } from "../data/courses";
import { useUser } from "../lib/user";
import { useToast } from "../lib/toast";

type ManualCourse = {
  _id: Id<"coursesManual">;
  name: string;
  cat: string;
  qty?: string;
  done: boolean;
  assigned?: string;
};

type Override = {
  _id: Id<"coursesOverrides">;
  autoId: string;
  done?: boolean;
  assigned?: string;
  deleted?: boolean;
  qtyNum?: string;
  qtyUnit?: string;
  name?: string;
};

type DisplayItem = {
  source: "auto" | "manual";
  manualId?: Id<"coursesManual">;
  autoId?: string;
  name: string;
  cat: string;
  qtyNum?: string;
  qtyUnit?: string;
  qty?: string;
  done: boolean;
  assigned?: string;
};

const CAT_COLLAPSE_KEY = "saywhat.catCollapsed";

function useCatCollapsed() {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(CAT_COLLAPSE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(CAT_COLLAPSE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);
  return [state, setState] as const;
}

export function CoursesView() {
  const { user } = useUser();
  const toast = useToast();

  const manual = (useQuery(api.courses.listManual) ?? []) as ManualCourse[];
  const overrides = (useQuery(api.courses.listOverrides) ?? []) as Override[];
  const addManual = useMutation(api.courses.addManual);
  const updateManual = useMutation(api.courses.updateManual);
  const deleteManual = useMutation(api.courses.deleteManual);
  const setOverride = useMutation(api.courses.setOverride);

  const [collapsed, setCollapsed] = useCatCollapsed();
  const [addOpen, setAddOpen] = useState(false);
  const [newQty, setNewQty] = useState("");
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<string>("Fruits & légumes");

  const autoCourses = useMemo<AutoCourse[]>(() => makeAutoCourses(), []);
  const overrideMap = useMemo(() => {
    const m = new Map<string, Override>();
    overrides.forEach((o) => m.set(o.autoId, o));
    return m;
  }, [overrides]);

  const items = useMemo<DisplayItem[]>(() => {
    const result: DisplayItem[] = [];
    autoCourses.forEach((c) => {
      const ov = overrideMap.get(c.id);
      if (ov?.deleted) return;
      result.push({
        source: "auto",
        autoId: c.id,
        name: ov?.name ?? c.name,
        cat: c.cat,
        qtyNum: ov?.qtyNum ?? c.qtyNum,
        qtyUnit: ov?.qtyUnit ?? c.qtyUnit,
        done: ov?.done ?? false,
        assigned: ov?.assigned,
      });
    });
    manual.forEach((m) => {
      result.push({
        source: "manual",
        manualId: m._id,
        name: m.name,
        cat: m.cat,
        qty: m.qty,
        done: m.done,
        assigned: m.assigned,
      });
    });
    return result;
  }, [autoCourses, overrideMap, manual]);

  const byCat = useMemo(() => {
    const m: Record<string, DisplayItem[]> = {};
    items.forEach((it) => {
      if (!m[it.cat]) m[it.cat] = [];
      m[it.cat].push(it);
    });
    return m;
  }, [items]);

  const buyables = items.filter((c) => c.cat !== "De la maison");
  const done = buyables.filter((c) => c.done).length;
  const assigned = buyables.filter((c) => c.assigned).length;
  const pct = buyables.length ? (done / buyables.length) * 100 : 0;

  const onToggleDone = async (it: DisplayItem) => {
    if (it.source === "auto" && it.autoId) {
      await setOverride({ autoId: it.autoId, done: !it.done });
    } else if (it.manualId) {
      await updateManual({ id: it.manualId, done: !it.done });
    }
  };

  const onToggleAssign = async (it: DisplayItem) => {
    const nextVal = it.assigned === user ? null : user;
    if (it.source === "auto" && it.autoId) {
      await setOverride({ autoId: it.autoId, assigned: nextVal });
    } else if (it.manualId) {
      await updateManual({ id: it.manualId, assigned: nextVal });
    }
  };

  const onDelete = async (it: DisplayItem) => {
    if (it.source === "auto" && it.autoId) {
      await setOverride({ autoId: it.autoId, deleted: true });
    } else if (it.manualId) {
      await deleteManual({ id: it.manualId });
    }
    toast(`${it.name} supprimé`);
  };

  const onUpdateName = async (it: DisplayItem, raw: string) => {
    if (!raw) return;
    if (it.source === "auto" && it.autoId) {
      const original = autoCourses.find((c) => c.id === it.autoId);
      if (original && raw === original.name) {
        await setOverride({ autoId: it.autoId, name: null });
      } else {
        await setOverride({ autoId: it.autoId, name: raw });
      }
    } else if (it.manualId) {
      await updateManual({ id: it.manualId, name: raw });
    }
  };

  const onUpdateQty = async (it: DisplayItem, raw: string) => {
    if (it.source === "auto" && it.autoId) {
      let qtyNum = "";
      let qtyUnit = "";
      if (raw.trim()) {
        const m = raw.trim().match(/^(-?\d+(?:[.,]\d+)?)\s*(.*)$/);
        if (m) {
          qtyNum = m[1].replace(",", ".");
          qtyUnit = m[2].trim();
        } else {
          qtyNum = raw.trim();
          qtyUnit = "";
        }
      }
      await setOverride({ autoId: it.autoId, qtyNum, qtyUnit });
    } else if (it.manualId) {
      await updateManual({ id: it.manualId, qty: raw });
    }
  };

  const onAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await addManual({ name, cat: newCat, qty: newQty.trim(), addedBy: user });
    setNewName("");
    setNewQty("");
    setAddOpen(false);
    toast(`${name} ajouté`);
  };

  const allCollapsed = CAT_ORDER.every((c) => collapsed[c]);

  return (
    <section className="view">
      <div className="view-title">Les courses</div>
      <div className="view-desc">
        Tape sur l'article = coché · double-tap sur le nom pour éditer · auto-générée depuis les recettes pour 15 personnes
      </div>

      <div className="courses-header">
        <div className="courses-header-stats">
          <div className="stat">
            <div className="stat-num">
              {done}
              <em>/{buyables.length}</em>
            </div>
            <div className="stat-label">cochés</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              {assigned}
              <em>/{buyables.length}</em>
            </div>
            <div className="stat-label">assignés</div>
          </div>
          <div className="progress-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="courses-info-row">
        <div className="icon">⚡</div>
        <div>
          Pour <strong>15 pers</strong> · 2 VG · 2 apéros + 3 repas
        </div>
      </div>

      <div className="quick-help">
        <span>
          <span className="swatch" style={{ background: "var(--primary)" }} />
          auto
        </span>
        <span>
          <span className="swatch" style={{ background: "var(--line-strong)" }} />
          manuel
        </span>
        <button
          className="collapse-all-btn"
          onClick={() => {
            const next: Record<string, boolean> = {};
            CAT_ORDER.forEach((c) => (next[c] = !allCollapsed));
            setCollapsed(next);
          }}
        >
          {allCollapsed ? "tout déplier" : "tout replier"}
        </button>
      </div>

      <button className="add-course-trigger" onClick={() => setAddOpen(true)}>
        <span className="add-course-trigger-plus">+</span>
        ajouter un article
      </button>

      {addOpen && (
        <AddCourseModal
          qty={newQty}
          name={newName}
          cat={newCat}
          onQtyChange={setNewQty}
          onNameChange={setNewName}
          onCatChange={setNewCat}
          onSubmit={onAdd}
          onClose={() => setAddOpen(false)}
        />
      )}

      <div>
        {CAT_ORDER.map((cat) => {
          const list = byCat[cat];
          if (!list || list.length === 0) return null;
          const isCollapsed = !!collapsed[cat];
          const catDone = list.filter((i) => i.done).length;
          const allDone = catDone === list.length;
          return (
            <div
              className={`cat ${isCollapsed ? "collapsed" : ""} ${allDone ? "fully-done" : ""}`}
              key={cat}
            >
              <div
                className="cat-head"
                onClick={() => setCollapsed((s) => ({ ...s, [cat]: !s[cat] }))}
              >
                <div className="cat-emoji">{CAT_EMOJI[cat] ?? ""}</div>
                <div className="cat-name">{cat}</div>
                <div className="cat-count">
                  {catDone}/{list.length}
                </div>
                <div className="cat-chevron">⌄</div>
              </div>
              <div className="cat-items">
                {list.map((it) => (
                  <CourseRow
                    key={`${it.source}-${it.autoId ?? it.manualId}`}
                    item={it}
                    user={user}
                    onToggleDone={onToggleDone}
                    onToggleAssign={onToggleAssign}
                    onDelete={onDelete}
                    onUpdateName={onUpdateName}
                    onUpdateQty={onUpdateQty}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AddCourseModal({
  qty,
  name,
  cat,
  onQtyChange,
  onNameChange,
  onCatChange,
  onSubmit,
  onClose,
}: {
  qty: string;
  name: string;
  cat: string;
  onQtyChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onCatChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-title">Ajouter un article</div>
        <div className="modal-form">
          <div className="modal-row">
            <input
              className="modal-input modal-input-qty"
              placeholder="qté"
              value={qty}
              onChange={(e) => onQtyChange(e.target.value)}
            />
            <input
              ref={nameRef}
              className="modal-input"
              placeholder="nom de l'article"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            />
          </div>
          <select
            className="modal-input modal-input-select"
            value={cat}
            onChange={(e) => onCatChange(e.target.value)}
          >
            {CAT_ORDER.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            className="modal-btn modal-btn-primary"
            onClick={onSubmit}
            disabled={!name.trim()}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseRow({
  item,
  onToggleDone,
  onToggleAssign,
  onDelete,
  onUpdateName,
  onUpdateQty,
}: {
  item: DisplayItem;
  user: string;
  onToggleDone: (it: DisplayItem) => void;
  onToggleAssign: (it: DisplayItem) => void;
  onDelete: (it: DisplayItem) => void;
  onUpdateName: (it: DisplayItem, raw: string) => void;
  onUpdateQty: (it: DisplayItem, raw: string) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [editingQty, setEditingQty] = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuto = item.source === "auto";

  let qtyDisplay: React.ReactNode;
  if (item.qtyNum !== undefined && item.qtyNum !== "") {
    qtyDisplay = (
      <>
        <span className="item-qty">{item.qtyNum}</span>
        <span className="item-qty-unit">{item.qtyUnit ?? ""}</span>
      </>
    );
  } else if (item.qty) {
    qtyDisplay = <span className="item-qty">{item.qty}</span>;
  } else {
    qtyDisplay = (
      <span className="item-qty" style={{ color: "var(--ink-faint)" }}>
        +qté
      </span>
    );
  }

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingName) return;
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      setEditingName(true);
    } else {
      tapTimer.current = setTimeout(() => {
        tapTimer.current = null;
        onToggleDone(item);
      }, 260);
    }
  };

  return (
    <div className={`item ${item.done ? "done" : ""} ${isAuto ? "auto" : ""}`}>
      <div
        className="check"
        onClick={(e) => {
          e.stopPropagation();
          onToggleDone(item);
        }}
      >
        <svg viewBox="0 0 24 24">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
      <div
        className={`item-qty-wrap ${editingQty ? "editing" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setEditingQty(true);
        }}
      >
        {editingQty ? (
          <input
            className="item-qty-edit"
            autoFocus
            defaultValue={
              item.qtyNum !== undefined && item.qtyNum !== ""
                ? `${item.qtyNum}${item.qtyUnit ? " " + item.qtyUnit : ""}`
                : item.qty ?? ""
            }
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              onUpdateQty(item, e.currentTarget.value);
              setEditingQty(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setEditingQty(false);
              }
            }}
          />
        ) : (
          qtyDisplay
        )}
      </div>
      <div className={`item-main ${editingName ? "editing" : ""}`} onClick={handleMainClick}>
        {editingName ? (
          <input
            className="item-name-edit"
            autoFocus
            defaultValue={item.name}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              const v = e.currentTarget.value.trim();
              if (v) onUpdateName(item, v);
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") setEditingName(false);
            }}
          />
        ) : (
          <div className="item-name">{item.name}</div>
        )}
      </div>
      <div className="item-actions">
        <button
          className={`item-assignee ${item.assigned ? "" : "empty"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAssign(item);
          }}
        >
          {item.assigned || "+ moi"}
        </button>
        <button
          className={`item-del ${delConfirm ? "confirm" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (delConfirm) {
              if (delTimer.current) clearTimeout(delTimer.current);
              setDelConfirm(false);
              onDelete(item);
            } else {
              setDelConfirm(true);
              if (delTimer.current) clearTimeout(delTimer.current);
              delTimer.current = setTimeout(() => setDelConfirm(false), 3000);
            }
          }}
        >
          {delConfirm ? "supprimer ?" : "×"}
        </button>
      </div>
    </div>
  );
}
