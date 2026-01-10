import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((msg, type = "info") => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 2600);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              "card px-4 py-3 border",
              t.type === "success" ? "border-green-200" : "",
              t.type === "error" ? "border-red-200" : ""
            ].join(" ")}
          >
            <div className="text-sm font-semibold">{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}



