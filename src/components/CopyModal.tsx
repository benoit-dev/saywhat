import { useEffect, useRef } from "react";

export function CopyModal({
  text,
  label,
  onClose,
}: {
  text: string;
  label: string;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
      inputRef.current?.setSelectionRange(0, text.length);
    }, 60);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div className="copy-modal" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="copy-modal-card">
        <div className="copy-modal-label">{label}</div>
        <input ref={inputRef} className="copy-modal-text" type="text" readOnly defaultValue={text} />
        <div className="copy-modal-hint">
          Tap-long sur le texte, puis "Copier"
          <br />
          (ton navigateur bloque la copie auto)
        </div>
        <button className="copy-modal-close" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
