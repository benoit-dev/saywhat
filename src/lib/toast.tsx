import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastCtx = (msg: string) => void;

const Ctx = createContext<ToastCtx>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);

  const show = useCallback((m: string) => {
    setMsg(m);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className={`toast ${msg ? "show" : ""}`}>{msg}</div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
