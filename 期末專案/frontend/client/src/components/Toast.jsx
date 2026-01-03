import { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const api = useMemo(() => ({
    show(msg, type = "info") {
      setToast({ msg, type, at: Date.now() });
      setTimeout(() => setToast(null), 2200);
    }
  }), []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className={`rounded-xl px-4 py-2 text-sm shadow border bg-white`}>
            {toast.msg}
          </div>
        </div>
      ) : null}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const v = useContext(ToastCtx);
  if (!v) throw new Error("useToast must be used inside ToastProvider");
  return v;
}
