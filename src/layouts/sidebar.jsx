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
import {
       HiOutlineBookOpen,
       HiOutlineCalendarDays,
       HiOutlineChatBubbleBottomCenterText,
       HiOutlineChevronDown,
       HiOutlineClock,
} from "react-icons/hi2";
import { FiRotateCcw } from "react-icons/fi";


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
                            <div id="modalContainer" style={{ willChange: "transform" }} className={`${open ? "pointer-events-auto translate-y-0" : "translate-y-[520px]"} duration-300 animate-emphasized transition-all w-[calc(100%-24px)] max-w-full absolute mx-3 bottom-3 h-fit max-h-fit bg-white dark:bg-neutral-600 dark:border-[#2a2e3c] dark:border rounded-xl overflow-y-auto snone pt-4 pb-8`}>
                                   {/* button closed */}
                                   <div className="w-full h-1 flex justify-center">
                                          <div className="w-16 h-1 bg-neutral-300 rounded-full"></div>
                                   </div>
                                   <div id="dragHandle" className="w-full font-morabba" style={{ touchAction: "none" }}>
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
                                                 <Modal isOpen={openAddPlan} onClose={() => setOpenAddPlan(prev => !prev)} textTitle={"افزودن درس جدید"} state={1}>
                                                        <div
                                                               className="w-full text-[#f4f6f8] pt-4"
                                                               dir="rtl"
                                                        >
                                                               <div className="py-0">
                                                                      {/* name */}
                                                                      <div className="w-full font-iranisans mb-[20px]">
                                                                             <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                                                    <span className="h-6 w-[3px] rounded-full bg-[#74e89a] md:h-8 md:w-[4px]" />
                                                                                    <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">نام درس</h2>
                                                                             </div>

                                                                             <div className="relative">
                                                                                    <input
                                                                                           ref={lessonInput}
                                                                                           autoComplete="off"
                                                                                           onChange={e => setLesson(e.target.value)}
                                                                                           defaultValue={lesson}
                                                                                           id="name"
                                                                                           type="text"
                                                                                           placeholder="برنامه سازی"
                                                                                           className="w-full transition-all h-[54px] rounded-[14px] border border-neutral-100 dark:border-[#3a424d] bg-white dark:bg-[#161c25] py-0 pr-[16px] pl-[48px] text-[15px] font-normal text-neutral-500 dark:text-[#f6f7f9] outline-none placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[60px] sm:text-[16px]"
                                                                                    />

                                                                                    <HiOutlineBookOpen
                                                                                           className="pointer-events-none absolute left-[15px] top-1/2 h-5 w-5 -translate-y-1/2 text-[#74e89a] stroke-[1.7]"
                                                                                           aria-hidden="true"
                                                                                    />
                                                                             </div>
                                                                      </div>

                                                                      {/* desc */}
                                                                      <div className="w-full font-iranisans mb-[22px]">
                                                                             <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                                                    <span className="h-6 w-[3px] rounded-full bg-[#74e89a] md:h-8 md:w-[4px]" />
                                                                                    <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">توضیحات</h2>
                                                                             </div>

                                                                             <div className="relative">
                                                                                    <input
                                                                                           ref={descInput}
                                                                                           autoComplete="off"
                                                                                           onChange={e => setDescription(e.target.value)}
                                                                                           defaultValue={description}
                                                                                           id="name"
                                                                                           type="text"
                                                                                           placeholder="کلاس 1112 ، طبقه دوم"
                                                                                           className="w-full transition-all h-[58px] rounded-[14px] border border-neutral-100 dark:border-[#3a424d] bg-white dark:bg-[#161c25] py-0 pr-[16px] pl-[48px] text-[14px] font-normal text-neutral-500 dark:text-[#f6f7f9] outline-none placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[16px]"
                                                                                    />

                                                                                    <HiOutlineChatBubbleBottomCenterText
                                                                                           className="pointer-events-none absolute left-[15px] top-1/2 h-5 w-5 -translate-y-1/2 text-[#74e89a] stroke-[1.7]"
                                                                                           aria-hidden="true"
                                                                                    />
                                                                             </div>
                                                                      </div>

                                                                      {/* select box */}
                                                                      <div className="w-full font-iranisans">
                                                                             <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                                                    <span className="h-6 w-[3px] rounded-full bg-[#74e89a] md:h-8 md:w-[4px]" />
                                                                                    <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">انتخاب روز هفته</h2>
                                                                             </div>

                                                                             <div className="relative">
                                                                                    <HiOutlineCalendarDays
                                                                                           className="pointer-events-none absolute right-[15px] top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#74e89a] stroke-[1.7]"
                                                                                           aria-hidden="true"
                                                                                    />

                                                                                    <select
                                                                                           id="simple-select"
                                                                                           ref={selInput}
                                                                                           defaultValue={selectValue}
                                                                                           onChange={e => setSelectValue(e.target.value)}
                                                                                           className="block w-full py-2 h-[54px] appearance-none rounded-[14px] border border-neutral-100 dark:border-[#3a424d] bg-white dark:bg-[#161c25] pr-[46px] pl-[44px] text-[15px] font-medium text-neutral-500 dark:text-[#f5f7f8] shadow-none outline-none sm:h-[60px] sm:text-[16px]"
                                                                                    >
                                                                                           <option value={0}>شنبه</option>
                                                                                           <option value={1}>یکشنبه</option>
                                                                                           <option value={2}>دوشنبه</option>
                                                                                           <option value={3}>سه شنبه</option>
                                                                                           <option value={4}>چهار شنبه</option>
                                                                                           <option value={5}>پنج شنبه</option>
                                                                                           <option value={6}>جمعه</option>
                                                                                    </select>

                                                                                    <HiOutlineChevronDown
                                                                                           className="pointer-events-none absolute left-[15px] top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 dark:text-[#dfe4e9] stroke-[1.8]"
                                                                                           aria-hidden="true"
                                                                                    />
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               {/* time selector */}
                                                               <div className="w-full mt-[26px] h-auto font-iranisans">
                                                                      <div className="mb-[18px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                                             <span className="h-6 w-[3px] rounded-full bg-[#74e89a] md:h-8 md:w-[4px]" />
                                                                             <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8]">بازه زمانی کلاس</h2>
                                                                      </div>

                                                                      <TimeSelector
                                                                             mood={1}
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

                                                               <div
                                                                      className="w-full font-iranisans text-center cursor-pointer mt-[14px] flex h-[48px] items-center justify-center gap-2 rounded-[13px] border border-[#ef7676]/30 bg-[#ef7676]/10 px-3 py-0 text-[13px] font-medium text-[#ff9b9b] transition-all duration-200 hover:bg-[#ef7676]/15 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#ef7676]/20 sm:h-[50px] sm:text-[14px]"
                                                                      onClick={resetFunc}
                                                               >
                                                                      <FiRotateCcw
                                                                             className="h-[17px] w-[17px] shrink-0"
                                                                             aria-hidden="true"
                                                                      />
                                                                      ریست کردن فیلد ها
                                                               </div>
                                                        </div>
                                                 </Modal>
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