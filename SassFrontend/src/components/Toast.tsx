import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  themeColor: 'orange' | 'teal';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, themeColor, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const themeClasses = {
    orange: {
      error: 'bg-orange-50 border-orange-200 text-orange-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      icon: 'text-orange-600',
    },
    teal: {
      error: 'bg-teal-50 border-teal-200 text-teal-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      icon: 'text-teal-600',
    },
  };

  const theme = themeClasses[themeColor];
  const colorClass = type === 'error' ? theme.error : theme.success;

  return (
    <div className={`fixed top-4 right-4 z-50 min-w-[300px] max-w-md ${colorClass} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-5`}>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 hover:opacity-70 rounded transition-opacity ${type === 'error' ? theme.icon : 'text-green-600'}`}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

