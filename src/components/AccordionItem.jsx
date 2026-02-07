import { useAccordion } from "./Accordion";
import { useEffect, useRef, useState } from "react";

export function AccordionItem({ eventKey, children, className = null, classNameBody = null }) {
       const { activeKeys, toggleItem, alwaysOpen } = useAccordion();

       const isOpen = alwaysOpen ? activeKeys.includes(eventKey) : activeKeys === eventKey;

       const contentRef = useRef(null);
       // const [height, setHeight] = useState(0); 
       const wrapperRef = useRef(null);
       const heightRef = useRef(0);

       useEffect(() => {
              const contentEl = contentRef.current;
              const wrapperEl = wrapperRef.current;
              if (!contentEl || !wrapperEl) return;

              // :red_circle: بسته شدن
              if (!isOpen) {
                     heightRef.current = 0;
                     wrapperEl.style.height = "0px";
                     return;
              }

              // 🟢 باز شدن
              const updateHeight = () => {
                     const newHeight = contentEl.scrollHeight;
                     if (heightRef.current !== newHeight) {
                            heightRef.current = newHeight;
                            wrapperEl.style.height = `${newHeight}px`;
                     }
              };

              updateHeight();

              const observer = new ResizeObserver(updateHeight);
              observer.observe(contentEl);

              return () => observer.disconnect();
       }, [isOpen]);

       return (
              <div className="" >
                     {/* Header */}
                     <div
                            className={`w-full h-fit flex items-center justify-between pe-2 cursor-pointer ${className}`}
                            onClick={() => toggleItem(eventKey)}
                     >
                            {children[0]}
                            <svg
                                   className={`w-4 h-4 min-w-4 min-h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2"
                                   viewBox="0 0 24 24"
                            >
                                   <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 9l-7 7-7-7"
                                   />
                            </svg>
                     </div>

                     {/* Body */}
                     <div
                            style={{ height: 0 }}
                            ref={wrapperRef}
                            className={"overflow-hidden transition-[height] duration-200 ease-in-out " + classNameBody}
                     >
                            <div ref={contentRef} className="px-5 py-4 space-y-3">
                                   {children[1]}
                            </div>
                     </div >
              </div >
       );
} 