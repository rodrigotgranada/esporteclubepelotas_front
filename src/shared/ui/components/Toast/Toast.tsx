import toast, { Toast as ToastType } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

interface ToastContainerProps {
  t: ToastType;
  title: string;
  message?: string;
  icon: React.ReactNode;
  borderColor: string;
}

const CustomToastContainer = ({ t, title, message, icon, borderColor }: ToastContainerProps) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#1c1c1c] shadow-2xl rounded-2xl border ${borderColor} pointer-events-auto flex p-4`}>
    <div className="flex-shrink-0 pt-0.5">
      {icon}
    </div>
    <div className="ml-3 flex-1">
      <p className="text-sm font-bold text-white">{title}</p>
      {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
    </div>
    <div className="ml-4 flex-shrink-0 flex items-start">
      <button 
        onClick={() => toast.dismiss(t.id)} 
        className="rounded-md inline-flex text-gray-500 hover:text-gray-300 transition-colors"
      >
        <span className="sr-only">Close</span>
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export const Toast = {
  success: (title: string, message?: string) => toast.custom((t) => (
    <CustomToastContainer 
      t={t} 
      title={title} 
      message={message} 
      icon={<CheckCircle className="h-6 w-6 text-green-500" />}
      borderColor="border-green-500/30"
    />
  )),
  error: (title: string, message?: string) => toast.custom((t) => (
    <CustomToastContainer 
      t={t} 
      title={title} 
      message={message} 
      icon={<XCircle className="h-6 w-6 text-red-500" />}
      borderColor="border-red-500/30"
    />
  )),
  warning: (title: string, message?: string) => toast.custom((t) => (
    <CustomToastContainer 
      t={t} 
      title={title} 
      message={message} 
      icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
      borderColor="border-yellow-500/30"
    />
  )),
};
