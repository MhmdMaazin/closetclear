import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[toast.type];

  const textColor = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[toast.type];

  const iconColor = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[toast.type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div
      className={`${bgColor} border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <p className={`text-sm font-medium ${textColor} flex-1`}>{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className={`flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
