import { useState, useEffect, memo, useRef } from "react"
import Modal from "../components/Modal";
import TimeSelector from "../components/time-selector/TimePicker";
import Counter from "../utils/Counter";
import { notifyError, notifySuccess } from "../utils/Tostify";
import { Add, Get } from "../utils/Storage";
import Random from "../utils/Random";
import { Link } from "react-router-dom";
import { usePlans, PlanTypeContext } from "../contexts/Plans";
// import { createPortal } from "react-dom";
import { RiArrowDownWideLine } from "react-icons/ri";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { VscOpenInWindow } from "react-icons/vsc";
import { LuNotebookPen } from "react-icons/lu";
import { LuNotebookText } from "react-icons/lu";
import { CiCircleQuestion } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";




import useDragHandle from "../hooks/useDragHandle";

const sidebar = () => {

       const { dispatch_Plan_Context } = usePlans();

       const [lesson, setLesson] = useState(null);
       const [description, setDescription] = useState(null);
       const [selectValue, setSelectValue] = useState(0);
       const lessonInput = useRef(null);
       const descInput = useRef(null);
       const selInput = useRef(null);


       const [open, setOpen] = useState(false);
       const [openAddPlan, setOpenAddPlan] = useState(false);

       const resetFunc = () => {
              setLesson(null);
              setDescription(null);
              setSelectValue(0);
              lessonInput.current.value = "";
              descInput.current.value = "";
              selInput.current.value = 0;
       }

       useEffect(() => {
              if (open) {
                     document.querySelector("html").style.overflow = "hidden";
              } else {
                     document.querySelector("html").style.overflow = "";
              }
       }, [open])

       useDragHandle(setOpen);

       return (
              <>
                     {/* hamber icon */}
                     <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 z-3">
                            <div className="min-w-xs max-w-lg mx-auto p-2">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="size-12 cursor-pointer" viewBox="0 0 24 24" fill="none" onClick={() => setOpen(prev => !prev)}>
                                          <path d="M4 6H20M4 12H14M4 18H9" className="stroke-neutral-900 dark:stroke-neutral-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                            </div>
                     </div>
                     {/* content */}
                     <section className={`${open ? "  opacity-100" : " opacity-0"} top-0 duration-300 transition-all w-full max-w-[500px] pointer-events-none h-dvh py-6 fixed left-1/2 -translate-x-1/2 z-4 `}>
                            <div id="modalContainer" style={{ willChange: "transform" }} className={`${open ? "pointer-events-auto translate-y-0" : "translate-y-[520px]"} duration-300 animate-emphasized transition-all w-[calc(100%-24px)] max-w-full absolute mx-3 bottom-3 h-fit max-h-fit bg-white dark:bg-neutral-600 rounded-xl overflow-y-auto snone pt-4 pb-8`}>
                                   {/* button closed */}
                                   <div id="dragHandle" style={{ touchAction: "none" }} className="w-full h-4 flex justify-center" onClick={() => setOpen(prev => !prev)}>
                                          <div className="w-16 h-1 bg-neutral-300 rounded-full"></div>
                                   </div>
                                   <div className="w-full font-morabba">
                                          {/* logo */}
                                          <div className="w-full h-34 text-3xl flex justify-center -mt-2 mb-4" dir="rtl">
                                                 <h1 className="font-ghaf flex justify-center items-center text-black dark:text-white">با</h1>
                                                 <img src={`${Get("them") === "dark" ? "/darschin/images/DarsChinLogo-White.png" : "/darschin/images/DarsChinLogo-Black.png"}`} className="object-cover scale-75 -mr-8" alt="" />
                                                 <h1 className="font-ghaf flex justify-center items-center -mr-8 text-black dark:text-white">به درسات نظم بده</h1>
                                          </div>
                                          <div className="w-full flex flex-col items-center justify-center gap-y-3 text-xl h-full -mt-4" dir="rtl">
                                                 {/* today plans */}
                                                 <Link
                                                        onClick={() => setOpen(prev => !prev)}
                                                        to="/"
                                                        className="flex justify-between items-center p-3 w-8/10 cursor-pointer  dark:bg-[#1b1e27] border border-[#00000026] dark:text-white rounded-lg text-center"
                                                 >
                                                        <div className="flex items-center gap-3">
                                                               <div className="size-8 bg-[#0c8a1226] flex justify-center items-center rounded-[8px]">
                                                                      <CiCalendar className="text-[#017100] dark:text-[#02dd00]" />
                                                               </div>
                                                               <span className="text-base">برنامه امروز</span>
                                                        </div>
                                                        <div>
                                                               <IoIosArrowBack />
                                                        </div>
                                                 </Link>
                                                 {/* add plan */}
                                                 <button className="flex justify-between items-center p-3 w-8/10 cursor-pointer  dark:bg-[#1b1e27] border border-[#00000026] dark:text-white rounded-lg" onClick={() => setOpenAddPlan(prev => !prev)}>
                                                        <div className="flex items-center gap-3">
                                                               <div className="size-8 bg-[#0051ff33] flex justify-center items-center rounded-[8px]">
                                                                      <LuNotebookPen strokeWidth={1} className="text-[#003491] dark:text-[#6fa2ff]" />
                                                               </div>
                                                               <span className="text-base">افزودن درس جدید</span>
                                                        </div>
                                                        <div>
                                                               <VscOpenInWindow />
                                                        </div>
                                                 </button>
                                                 <Modal isOpen={openAddPlan} onClose={() => setOpenAddPlan(prev => !prev)}>
                                                        <div className="w-full rounded-xl bg-white dark:bg-neutral-600 mx-auto" dir="rtl">
                                                               <h1 className="w-full py-6 text-center font-morabba-bold text-3xl">افزودن درس جدید</h1>
                                                               <div className="py-4">
                                                                      {/* name */}
                                                                      <div className="w-full font-iranisans mb-2">
                                                                             <label htmlFor="name" className="block mb-2 ">
                                                                                    نام درس
                                                                             </label>
                                                                             <input
                                                                                    ref={lessonInput}
                                                                                    autoComplete="off"
                                                                                    onChange={e => setLesson(e.target.value)}
                                                                                    defaultValue={lesson}
                                                                                    id="name" type="text" placeholder="برنامه سازی" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                                                                      </div>
                                                                      {/* desc */}
                                                                      <div className="w-full font-iranisans mb-2">
                                                                             <label htmlFor="name" className="block mb-2 ">
                                                                                    توضیحات
                                                                             </label>
                                                                             <input
                                                                                    ref={descInput}
                                                                                    autoComplete="off"
                                                                                    onChange={e => setDescription(e.target.value)}
                                                                                    defaultValue={description}
                                                                                    id="name" type="text" placeholder="کلاس 1112 ، طبقه دوم" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                                                                      </div>
                                                                      {/* select box */}
                                                                      <div className="w-full font-iranisans">
                                                                             <label htmlFor="simple-select" className="block mb-2 ">
                                                                                    انتخاب روز هفته
                                                                             </label>
                                                                             <select id="simple-select"
                                                                                    ref={selInput}
                                                                                    defaultValue={selectValue}
                                                                                    onChange={e => setSelectValue(e.target.value)}
                                                                                    className="block w-full rounded-md border-1 outline-1 outline-neutral-300 border-neutral-300 bg-white dark:bg-neutral-700 px-3 py-2 shadow-sm focus:border-secondary focus:outline-secondary">
                                                                                    <option value={0}>شنبه</option>
                                                                                    <option value={1}>یکشنبه</option>
                                                                                    <option value={2}>دوشنبه</option>
                                                                                    <option value={3}>سه شنبه</option>
                                                                                    <option value={4}>چهار شنبه</option>
                                                                                    <option value={5}>پنج شنبه</option>
                                                                                    <option value={6}>جمعه</option>
                                                                             </select>
                                                                      </div>
                                                               </div>
                                                               <div className="w-full h-50 ">
                                                                      <TimeSelector
                                                                             callback={e => {
                                                                                    if (!lesson || !description) {
                                                                                           notifyError("ابتدا فیلد ها رو پر کنید");
                                                                                           return;
                                                                                    }
                                                                                    const data = {
                                                                                           start: e.from,
                                                                                           end: e.to,
                                                                                           day: selectValue,
                                                                                           lesson: lesson,
                                                                                           description: description,
                                                                                           hours: Counter(e.from, e.to).length,
                                                                                           id: Random((Get("plans") ?? []))
                                                                                    };

                                                                                    //add plan
                                                                                    dispatch_Plan_Context({
                                                                                           type: PlanTypeContext.ADD_PLAN,
                                                                                           addingData: data
                                                                                    })

                                                                                    // reset 
                                                                                    // resetFunc();
                                                                                    // console.log("ok", lesson, description, selectValue);
                                                                             }}
                                                                             defaultStart="08"
                                                                             defaultEnd="10"
                                                                      />
                                                               </div>
                                                               <div className="w-full py-2 -mt-2 rounded-xl bg-red-200 font-iranisans text-center cursor-pointer" onClick={resetFunc}>
                                                                      ریست کردن فیلد ها
                                                               </div>
                                                        </div>
                                                 </Modal>
                                                 {/* all plans */}
                                                 <Link
                                                        onClick={() => setOpen(prev => !prev)}
                                                        to="/plans"
                                                        className="flex justify-between items-center p-3 w-8/10 cursor-pointer  dark:bg-[#1b1e27] border border-[#00000026] dark:text-white rounded-lg text-center"
                                                 >
                                                        <div className="flex items-center gap-3">
                                                               <div className="size-8 bg-[#ff145733] flex justify-center items-center rounded-[8px]">
                                                                      <LuNotebookText strokeWidth={1} className="text-[#a50331] dark:text-[#ff6993]" />
                                                               </div>
                                                               <span className="text-base"> نمایش تمام درس ها</span>
                                                        </div>
                                                        <div>
                                                               <IoIosArrowBack />
                                                        </div>
                                                 </Link>
                                                 {/* FAQ */}
                                                 <Link
                                                        to="/faq"
                                                        className="flex justify-between items-center p-3 w-8/10 cursor-pointer  dark:bg-[#1b1e27] border border-[#00000026] dark:text-white py-2 rounded-lg text-center"
                                                        onClick={() => setOpen(prev => !prev)}
                                                 >
                                                        <div className="flex items-center gap-3">
                                                               <div className="size-8 bg-[#7f047f40] flex justify-center items-center rounded-[8px]">
                                                                      <CiCircleQuestion strokeWidth={0.5} className="text-[#9d009d] dark:text-[#ff38ff]" />
                                                               </div>
                                                               <span className="text-base">  سوالات متداول</span>
                                                        </div>
                                                        <div>
                                                               <IoIosArrowBack />
                                                        </div>
                                                 </Link>
                                                 {/* Settings */}
                                                 <Link
                                                        to="/settings"
                                                        className="flex justify-between items-center p-3 w-8/10 cursor-pointer  dark:bg-[#1b1e27] border border-[#00000026] dark:text-white py-2 rounded-lg text-center"
                                                        onClick={() => setOpen(prev => !prev)}
                                                 >
                                                        <div className="flex items-center gap-3">
                                                               <div className="size-8 bg-[#009f9f40] flex justify-center items-center rounded-[8px]">
                                                                      <IoSettingsOutline strokeWidth={1} className="text-[#005959] dark:text-[#15ffff]" />
                                                               </div>
                                                               <span className="text-base"> تنظیمات</span>
                                                        </div>
                                                        <div>
                                                               <IoIosArrowBack />
                                                        </div>
                                                 </Link>
                                          </div>
                                   </div>
                            </div>
                     </section>
                     {/* bg blur */}
                     <div className={`${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-all ease-emphasized duration-300 backdrop-blur-sm fixed top-0 left-0 w-full h-full bg-black/50 z-3`} onClick={() => setOpen(prev => !prev)}></div>
              </>

       )
}

export default sidebar