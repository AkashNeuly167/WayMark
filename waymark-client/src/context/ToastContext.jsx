import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useState } from "react";

import ToastContext from "./toastContextCore";

function ToastItem({ toast, onClose }) {
  const styles = {
    success: {
      icon: <CheckCircle2 size={22} />,
      iconClass: "text-green-500",
      border: "border-green-100",
      bg: "bg-green-50",
    },
    error: {
      icon: <AlertCircle size={22} />,
      iconClass: "text-red-500",
      border: "border-red-100",
      bg: "bg-red-50",
    },
    info: {
      icon: <Info size={22} />,
      iconClass: "text-[#F6AD55]",
      border: "border-orange-100",
      bg: "bg-orange-50",
    },
  };

  const current = styles[toast.type] || styles.info;

  return (
    <div
      className={`w-full rounded-3xl border ${current.border} ${current.bg} p-4 shadow-xl`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${current.iconClass}`}>{current.icon}</div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-[#002045]">{toast.title}</h4>

          {toast.message && (
            <p className="mt-1 text-sm leading-5 text-[#002045]/60">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-full p-1 text-[#002045]/40 transition hover:bg-white hover:text-[#002045]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({
    type = "info",
    title = "Notification",
    message = "",
  }) => {
    const id = `${Date.now()}-${Math.random()}`;

    const newToast = {
      id,
      type,
      title,
      message,
    };

    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-4 z-[150] flex flex-col gap-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:w-[380px]">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;