import { createPortal } from "react-dom";
import { memo } from "react";

const Modal = ({ isOpen, onClose, children, closeBtn = true, textTitle = null, state = 0 /* 0=default | 1=success | 2=warning | 3=danger | 4=info */ }) => {


       if (!isOpen) return null;

       const iconHandler = state => {
              switch (state) {
                     case 1: { // success
                            return (
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-green-500 absolute top-5.5 right-4 size-6">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                   </svg>
                            );
                     }
                     case 2: {
                            return (
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-yellow-500 absolute top-5.5 right-4 size-6">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                   </svg>
                            );
                     }
                     case 3: {
                            return (
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-red-500 absolute top-5.5 right-4 size-6">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                   </svg>
                            );
                     }
                     case 4: {
                            return (
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-cyan-500 absolute top-5.5 right-4 size-6">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                   </svg>
                            );
                     }
                     default: {
                            return "";
                     }
              }
       }

       return createPortal(
              <div
                     className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-99999 animate-fadeInBg"
                     onClick={onClose}
              >
                     <div
                            className="bg-white dark:bg-neutral-600 dark:border-[#2a2e3c] dark:border text-black dark:text-white rounded-2xl shadow-lg p-6 pt-14 max-h-[90vh] w-9/10 max-w-lg relative animate-fadeIn overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                     >
                            {/* icon */}
                            {
                                   iconHandler(state)
                            }
                            {/* close */}
                            <button
                                   className="absolute top-4 left-4 dark:text-gray-200 text-neutral-800 bg-neutral-200 dark:bg-neutral-500 size-8 rounded-lg"
                                   onClick={onClose}
                            >
                                   {closeBtn && "✕"}
                            </button>
                            {/* title */}
                            <p className={`absolute top-5 right-12 w-[calc(100%-100px)] line-clamp-1 font-morabba text-lg ${state === 3 ? "text-red-500" : (state === 2 ? "text-yellow-500" : (state === 1 ? "text-green-500" : (state === 4 ? "text-cyan-500" : "")))}`} dir="rtl">{textTitle}</p>
                            {children}
                     </div>
              </div>
              , document.body
       );
};

export default memo(Modal);
