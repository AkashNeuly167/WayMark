import { AlertTriangle, Loader2, X } from "lucide-react";

function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
      {/* Overlay click area */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
      />

      {/* Dialog */}
      <div className="relative w-full rounded-t-[32px] bg-white px-5 pb-6 pt-5 shadow-2xl sm:max-w-md sm:rounded-[32px] sm:p-6">
        {/* Mobile drag handle */}
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D8DEE6] sm:hidden" />

        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-[#002045]">{title}</h3>

            <p className="mt-1 text-sm leading-6 text-[#002045]/60">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="hidden rounded-full p-2 text-[#002045]/50 transition hover:bg-[#F1F5F9] hover:text-[#002045] disabled:opacity-50 sm:block"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-2xl border border-[#D8DEE6] px-5 py-3.5 font-semibold text-[#002045] transition active:scale-[0.98] hover:bg-[#F7FAFC] disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3.5 font-semibold text-white transition active:scale-[0.98] hover:bg-red-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;