import { toast } from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  const showLoading = (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showLoading,
    dismiss,
  };
};