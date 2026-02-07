import { useReducer, createContext, useContext } from "react";
import { Add, Get } from "../utils/Storage";
import { notifyError, notifySuccess } from "../utils/Tostify";

const PlanContext = createContext();

export const PlanTypeContext = {
     ADD_PLAN: "ADD_PLAN",
     DELETE_PLAN: "DELETE_PLAN",
     EDIT_PLAN: "EDIT_PLAN",
     ADD_FULL_DATA_PLAN : "ADD_FULL_DATA_PLAN" 
}

export function PlanProvider({ children }) {

     const [plans, dispatch] = useReducer((state, action) => {
          switch (action.type) {
               case PlanTypeContext.ADD_PLAN:
                    const allData = Get("plans")
                    if (allData) {
                         Add("plans", [
                              ...allData,
                              action.addingData
                         ])
                    } else {
                         Add("plans", [action.addingData]);
                    }
                    notifySuccess("افزودن درس موفقیت آمیز بود");
                    return Get("plans");
               case PlanTypeContext.DELETE_PLAN:
                    const otherPlan = Get("plans").filter(item => item.id !== Number(action.planID));
                    Add("plans", otherPlan);
                    notifySuccess("درس مورد نظر با موفقیت حذف شد!");
                    return Get("plans");
               case PlanTypeContext.EDIT_PLAN : 
                    const otherPlan2 = Get("plans").filter(item => item.id !== Number(action.planId));
                    otherPlan2.push(action.editingData)
                    Add("plans" , otherPlan2)
                    notifySuccess("ویرایش موفقیت آمیز بود")
                    return Get("plans");
               case PlanTypeContext.ADD_FULL_DATA_PLAN : 
                    Add("plans" , action.fullData)
                    return Get("plans");
               default:
                    notifyError("مشکل در کنترل اطلاعات!")
                    return Get("plans");
          }
     }, Get("plans") ?? [])

     return (
          <PlanContext.Provider value={{ plans_context: plans, dispatch_Plan_Context: dispatch }}>
               {children}
          </PlanContext.Provider>
     )
}

export const usePlans = () => useContext(PlanContext)
