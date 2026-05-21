import { useEffect, useState, type ReactNode } from "react";
import { ACCESS_CODE } from "../data/constants";

const GATE_KEY = "saywhat.gateOk";

export function AccessGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GATE_KEY) === "yes";
    } catch {
      return false;
    }
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ok) {
      try {
        localStorage.setItem(GATE_KEY, "yes");
      } catch {
        // ignore
      }
    }
  }, [ok]);

  if (ok) return <>{children}</>;

  const tryEnter = () => {
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      setOk(true);
    } else {
      setError("nope — réessaie");
      setCode("");
    }
  };

  return (
    <div className="gate">
      <div className="gate-eyebrow">SAYWHAT · CHALET 2026</div>
      <h1 className="gate-title">
        Le retour <em>des OGs.</em>
      </h1>
      <div className="gate-sub">
        Tape le code partagé pour entrer dans l'app du weekend.
      </div>
      <form
        className="gate-form"
        onSubmit={(e) => {
          e.preventDefault();
          tryEnter();
        }}
      >
        <input
          autoFocus
          className="gate-input"
          placeholder="code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {error && <div className="gate-error">{error}</div>}
        <button type="submit" className="gate-btn" disabled={!code.trim()}>
          Entrer
        </button>
      </form>
    </div>
  );
}
