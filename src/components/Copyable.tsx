import { useState, type ReactNode } from "react";
import { copyToClipboard } from "../lib/copy";
import { useToast } from "../lib/toast";
import { CopyModal } from "./CopyModal";

export function Copyable({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const toast = useToast();

  return (
    <>
      <button
        type="button"
        className={`copyable ${copied ? "copied" : ""}`}
        onClick={async () => {
          const ok = await copyToClipboard(value);
          if (ok) {
            setCopied(true);
            toast(`${label} copié`);
            setTimeout(() => setCopied(false), 2000);
          } else {
            setModal(true);
          }
        }}
      >
        <div className="value-wrap">{children}</div>
        <span className="copy-icon">
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </span>
      </button>
      {modal && <CopyModal text={value} label={label} onClose={() => setModal(false)} />}
    </>
  );
}
