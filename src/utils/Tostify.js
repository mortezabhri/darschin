//------FIRST : PASTE <ToastContainer /> IN JSX COMPONENT------------
import { toast, Flip } from 'react-toastify';
import { Get } from './Storage';

export const notifyError = (msg) => toast.error(msg, {
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: false,
     draggable: true,
     progress: undefined,
     theme: Get("them") ?? 'light',
     transition: Flip,
     pauseOnFocusLoss: false,
     className: "!font-iranisans border border-neutral-300"
});
export const notifySuccess = (msg) => toast.success(msg, {
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: false,
     draggable: true,
     progress: undefined,
     theme: Get("them") ?? 'light',
     transition: Flip,
     pauseOnFocusLoss: false,
     className: "!font-iranisans border border-neutral-300"
});
export const notifyWarn = (msg) => toast.loading(msg, {
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: false,
     draggable: true,
     progress: undefined,
     theme: Get("them") ?? 'light',
     transition: Flip,
     pauseOnFocusLoss: false,
     className: "!font-iranisans border border-neutral-300"
});