import React from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLearning();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel bg-surface-100/90 shadow-glass border border-white/10 text-white animate-slide-up"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
