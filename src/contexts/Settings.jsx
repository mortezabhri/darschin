import { createContext, useContext, useReducer } from "react";
import { Add, Get } from "../utils/Storage";
import counter from "../utils/Counter";

const SettingsContext = createContext();

// Types
export const SettingsContextTypes = {
       CHANGE_HOURS: "CHANGE_HOURS"
}
// Provider Component
export function SettingsProvider({ children }) {

       if (!Get("settings")) {
              Add("settings", {
                     startHour: 8,
                     endHour: 20,
                     counter: counter(8, 20)
              })
       }

       const [settings, dispatch] = useReducer((state, action) => {
              switch (action.type) {
                     case SettingsContextTypes.CHANGE_HOURS:
                            const data = {
                                   startHour: action.startHour,
                                   endHour: action.endHour,
                                   counter: counter(action.startHour, action.endHour)
                            };
                            Add("settings", data);
                            return data;
              }
       }, {
              startHour: Get("settings").startHour,
              endHour: Get("settings").endHour,
              counter: Get("settings").counter
       });

       return (
              <SettingsContext.Provider value={{ settings, dispatch }}>
                     {children}
              </SettingsContext.Provider>
       )
}
// Getting Values
export const useSettings = () => useContext(SettingsContext);
