'use client';
import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let _add: (msg: string, type: ToastType) => void = () => {};

export function toast(message: string, type: ToastType = 'info') {
  _add(message, type);
}

const colors: Record<ToastType, string> = {
  success: 'bg-green-800 border-green-600',
  error: 'bg-red-900 border-red-600',
  info: 'bg-slate-700 border-slate-600',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    _add = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-3 rounded-lg border text-sm text-white shadow-lg ${colors[t.type]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
