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
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 px-0 backdrop-blur-md sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
      />

      <div className="relative w-full rounded-t-[32px] border border-white/10 bg-[#101D2E] px-5 pb-6 pt-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:max-w-md sm:rounded-[32px] sm:p-6">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" />

        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertTriangle size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-white">{title}</h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="hidden rounded-full border border-white/10 bg-white/[0.06] p-2 text-slate-400 transition hover:bg-white/[0.1] hover:text-white disabled:opacity-50 sm:block"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 px-5 py-3.5 font-black text-white transition hover:bg-white/[0.08] active:scale-[0.98] disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3.5 font-black text-white transition hover:bg-red-600 active:scale-[0.98] disabled:opacity-60"
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