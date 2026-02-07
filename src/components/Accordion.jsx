import { createContext, useContext, useState, useCallback } from "react";

const AccordionContext = createContext(null);

export function Accordion({
       children,
       defaultActiveKey = null,
       alwaysOpen = false,
       className = null
}) {
       const [activeKeys, setActiveKeys] = useState(
              alwaysOpen
                     ? Array.isArray(defaultActiveKey)
                            ? defaultActiveKey
                            : defaultActiveKey
                                   ? [defaultActiveKey]
                                   : []
                     : defaultActiveKey
       );

       const toggleItem = useCallback(
              (key) => {
                     if (alwaysOpen) {
                            setActiveKeys((prev) =>
                                   prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                            );
                     } else {
                            setActiveKeys((prev) => (prev === key ? null : key));
                     }
              },
              [alwaysOpen]
       );

       return (
              <AccordionContext.Provider
                     value={{ activeKeys, toggleItem, alwaysOpen }}
              >
                     <div className={className ?? `w-full space-y-4`}>
                            {children}
                     </div>
              </AccordionContext.Provider>
       );
}

export const useAccordion = () => useContext(AccordionContext);