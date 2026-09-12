import { Add, Get } from "../utils/Storage";
import { useSettings } from "../contexts/Settings";
import Random from "../utils/Random";
import { notifyError, notifySuccess, notifyWarn } from "../utils/Tostify";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Badge from "./badge";
import { formatDatePlusDaysFrom } from "../utils/getDateToday";
import { GetNextWeekDateRange, GetThisWeekDateRange } from "../utils/GetWeekRange";
// import { getWeekSaturdayToFriday } from "../utils/GetWeekRange";
import { usePlans, PlanTypeContext } from "../contexts/Plans";
import HamberMenu from "../components/HamberMenu";
import Counter from "../utils/Counter";
import TimeSelector from "../components/time-selector/TimePicker";
import toPersianDigit from "../utils/toPersianDigit";
import {
       HiOutlineAcademicCap,
       HiOutlineBeaker,
       HiOutlineBookOpen,
       HiOutlineCalendarDays,
       HiOutlineChatBubbleBottomCenterText,
       HiOutlineCheckCircle,
       HiOutlineChevronDown,
       HiOutlineClock,
       HiOutlinePencilSquare,
       HiOutlineSquares2X2,
       HiOutlineUser,
       HiOutlineXMark,
} from "react-icons/hi2";
import { MdOutlineNewLabel } from "react-icons/md";
import { MdEdit } from "react-icons/md";



export default function ({ day }) {

       // DELETE MODAL CONTENT
       const [showDeleteModal, setShowDeleteModal] = useState(false);
       const [deleteID, setDeleteID] = useState(null);
       // DESCRIPTION MODAL CONTENT
       const [openDescription, setOpenDescription] = useState(false);
       const [description, setDescription] = useState(null);
       //new version added
       const [master, setMaster] = useState(null);
       const [allUnits, setAllUnits] = useState("0-0-0");
       const [examDay, setExamDay] = useState(null);
       const [examTime, setExamTime] = useState(null);
       //BADGE MODAL
       const [openBadge, setOpenBadge] = useState(false); // open modal badge create
       const [titleBadeg, setTitleBadeg] = useState(null); // title input
       const [descBadeg, setDescBadeg] = useState(null); // desc input
       const [idBadge, setIdBadge] = useState(null); // id badge clicked
       const [dateBadge, setDateBadge] = useState("all"); // when badge showing (radio buttons)
       const inputChars = useRef();
       const thisWeek = GetThisWeekDateRange();
       const nextWeek = GetNextWeekDateRange();
       // OPEN HAMBER MENU
       const [openHamber, setOpenHamber] = useState(0);
       // EDIT PLAN
       const [openEditModal, setOpenEditModal] = useState(false);
       const [editLesson, seteditLesson] = useState(null);
       const [editPlanID, setEditPlanID] = useState(null);
       const [editDescription, setEditDescription] = useState(null);
       const [editSelectValue, setEditSelectValue] = useState(0);
       // new version added
       const [editMasterName, setEditMasterName] = useState(null);
       const [editExamDay, setEditExamDay] = useState(null);
       const [editExamTime, setEditExamTime] = useState(null);
       const [editTotalUnits, setEditTotalUnits] = useState("0-0-0");
       const [defaultStartTimeEditPlan, setDefaultStartTimeEditPlan] = useState(0)
       const [defaultEndTimeEditPlan, setDefaultEndTimeEditPlan] = useState(0)
       // CUTTED PLANS
       const [cuttedPlans, setCuttedPlans] = useState([])
       // custome states 
       const [modalTitle, setModalTitle] = useState(null);

       const { plans_context, dispatch_Plan_Context } = usePlans();

       const handleEditPlan = (planID) => {
              const plan = Get("plans").filter(item => item.id === planID)[0]
              seteditLesson(plan.lesson)
              setEditDescription(plan.description)
              setEditSelectValue(plan.day)
              setDefaultStartTimeEditPlan(plan.start)
              setDefaultEndTimeEditPlan(plan.end)
              setEditPlanID(planID)
              // news version
              setEditMasterName(plan.master ?? null)
              setEditTotalUnits(plan.all_units ?? "0-0-0")
              setEditExamDay(plan.exam_day ?? null)
              setEditExamTime(plan.exam_time ?? null)

              setOpenEditModal(prev => !prev)
       }
       const handleTitleModal = (planID) => {
              const plan = Get("plans").filter(item => item.id === planID)[0]
              setModalTitle(plan.lesson);
       }

       const daysOfWeek = [
              "شنبه",
              "یک شنبه",
              "دو شنبه",
              "سه شنبه",
              "چهار شنبه",
              "پنج شنبه",
              "جمعه",
       ]

       const parentRef = useRef(null);

       const { settings } = useSettings();
       const findFreeTimes2 = useCallback((startTime, endTime, busyTimes, day) => {
              // sorting with time
              busyTimes.sort((a, b) => a.start - b.start);

              let freeTimes = [];
              let current = Number(startTime);

              for (let i = 0; i < busyTimes.length; i++) {
                     let busy = busyTimes[i];

                     // out of time rang
                     if (Number(busy.start) < Number(startTime) || Number(busy.end) > Number(endTime)) {
                            dispatch_Plan_Context({
                                   type: PlanTypeContext.DELETE_PLAN,
                                   planID: busy.id
                            })
                            notifyError("درس وارد شده بدلیل خارج بودن محدوده زمانی حذف شد")
                            return;
                     }

                     // conflict with last data
                     if (i > 0 && Number(busy.start) < Number(busyTimes[i - 1].end)) {
                            dispatch_Plan_Context({
                                   type: PlanTypeContext.DELETE_PLAN,
                                   planID: busy.id
                            })
                            notifyError("درس وارد شده بدلیل تداخل حذف شد")
                            return;
                     }

                     // remove all spaces between times
                     if (Number(busy.start) > current) {
                            freeTimes.push({ name: " ", start: current, end: Number(busy.start), hours: Number(busy.start) - current, day, id: Random(Get("plans")) });
                     }

                     current = Number(busy.end);
              }

              // remove all spaces from last data
              if (current < endTime) {
                     freeTimes.push({ name: " ", start: current, end: endTime, hours: endTime - current, day, id: Random(Get("plans")) });
              }

              return freeTimes;
       })
       // get all plan from localstorage (in context)
       // let cuttedPlans = [];
       let plans = [];
       useEffect(() => {
              plans = plans_context
              if (plans) {
                     plans = plans.filter(item => Number(item.day) === Number(day));// GET TODAY NUMBER OF THE WEEK
                     const emptyPlansPlusWithAllPlans = plans && plans.concat(findFreeTimes2(settings.startHour, settings.endHour, plans, day))
                     setCuttedPlans(emptyPlansPlusWithAllPlans.filter(Boolean))
              };
       }, [plans_context])

       //badge functions
       const approvedBadge = () => {
              //Empty errors
              if (titleBadeg === null) {
                     notifyError("فیلد نام لازمه!");
                     return;
              }
              const allPlansWithoutThisID = Get("plans").filter(item => item.id !== idBadge);
              const thisID = Get("plans").filter(item => item.id === idBadge)[0];

              // maximum length badges
              let countBadgesInDay = 0;
              let countBadgesInDay_nextWeek = 0;
              // date === "this week" or "all days"
              if (thisID.badges && (dateBadge === "all" || thisWeek.includes(dateBadge))) {
                     countBadgesInDay = thisID.badges.filter(item => thisWeek.includes(item.date)).length + thisID.badges.filter(item => item.date === "all").length;
              }
              // date === "next week"
              if (thisID.badges && (dateBadge === "all" || nextWeek.includes(dateBadge))) {
                     countBadgesInDay_nextWeek = thisID.badges.filter(item => nextWeek.includes(item.date)).length + thisID.badges.filter(item => item.date === "all").length;
              }

              if (countBadgesInDay >= 3) {
                     notifyError("تعداد برچسب ها باید کمتر از 3 تا باشه")
                     return;
              }
              if (countBadgesInDay_nextWeek >= 3) {
                     notifyError("تعداد برچسب های هفته بعدت هم باید کمتر از 3 تا باشه")
                     return;
              }

              const thisBadge = {
                     name: titleBadeg,
                     description: descBadeg,
                     date: dateBadge,
                     id: Math.floor(Math.random() * thisID.id)
              }

              let badges = [];
              if (thisID.badges) {
                     badges = thisID.badges;
                     badges.push(thisBadge);
              } else {
                     badges.push(thisBadge);
              }
              allPlansWithoutThisID.push({
                     ...thisID,
                     badges
              })
              dispatch_Plan_Context({
                     type: PlanTypeContext.ADD_FULL_DATA_PLAN,
                     fullData: allPlansWithoutThisID
              })
              notifySuccess("برچسب افزوده شد");
              setOpenBadge(false);
              setDateBadge(null)
              setIdBadge(null);
              setTitleBadeg(null)
              setDescBadeg(null)
       }

       useEffect(() => {
              if (inputChars.current) {
                     inputChars.current.textContent = `${titleBadeg.length}/10`
                     if (titleBadeg.length >= 10) {
                            inputChars.current.classList.add("text-red-900-m")
                     } else {

                            inputChars.current.classList.remove("text-red-900-m")
                     }
              }
       }, [titleBadeg])

       // console.log(formatDatePlusDaysFrom(new Date().toLocaleDateString(), 7))
       // console.log(getWeekSaturdayToFriday("2025/10/19"))
       // console.log(getWeekSaturdayToFriday())
       // console.log(formatDatePlusDaysFrom(new Date()))
       // console.log(idBadge  )
       // console.log(editTotalUnits && editTotalUnits.split("-"))

       return (
              <>
                     {/* DELETE MODAL */}
                     <Modal onClose={() => setShowDeleteModal(prev => !prev)} isOpen={showDeleteModal} textTitle={`حذف درس ${modalTitle}`} state={3}>
                            <h1 className="w-full pt-4 pb-2 px-2 text-2xl font-iranisans text-center text-red-500">
                                   آیا از حذف این درس اطمینان دارید؟
                            </h1>
                            <div className="pt-4 flex justify-center gap-x-2">
                                   <button className="w-3/10 py-3 px-2 bg-red-300 dark:text-black rounded-xl font-iranisans cursor-pointer text-sm" onClick={() => setShowDeleteModal(prev => !prev)} dir="rtl">کنسله!</button>
                                   <button onClick={() => {
                                          dispatch_Plan_Context({
                                                 type: PlanTypeContext.DELETE_PLAN,
                                                 planID: deleteID
                                          })
                                          setShowDeleteModal(prev => !prev);
                                   }} className="cursor-pointer w-7/10 py-3 px-2 bg-green-300 rounded-xl font-iranisans dark:text-black text-sm">آره ، حذفش کن</button>
                            </div>
                     </Modal>
                     {/* BADEG MODAL (CREATE)*/}
                     <Modal onClose={() => setOpenBadge(prev => !prev)} isOpen={openBadge} textTitle={`ایجاد برچسب برای ${modalTitle}`} state={2}>
                            {/* <h1 className="w-full pt-4 pb-6 px-2 text-2xl font-iranisans text-center text-amber-600" dir="rtl">
                                   ایجاد برچسب جدید برای {(idBadge && Get("plans").filter(item => item.id === idBadge)) && Get("plans").filter(item => item.id === idBadge)[0].lesson}
                            </h1> */}
                            <div className="w-full mt-5">
                                   <div className="w-full font-iranisans mb-8" dir="rtl">

                                          <div className="mb-[20px] flex items-center gap-2">
                                                 <span className="h-6 w-[3px] rounded-full bg-yellow-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px] ">نام برچسب *</h2>
                                          </div>

                                          <div className="relative">
                                                 <input
                                                        maxLength={10}
                                                        autoComplete="off"
                                                        onChange={e => setTitleBadeg(e.target.value)}
                                                        defaultValue={titleBadeg}
                                                        type="text"
                                                        placeholder="20 تاخیر"
                                                        className="w-full h-[56px] rounded-[14px] border border-neutral-200 dark:border-[#3a424d] bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal text-neutral-500 dark:text-[#f6f7f9] outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                 />
                                                 <MdOutlineNewLabel className="pointer-events-none -mt-0.5 absolute left-[16px] top-1/2 h-5 w-5 -translate-y-1/2 sm:left-[19px] sm:h-6 sm:w-6 md:left-[25px] md:h-7 md:w-7 text-cyan-500 " aria-hidden="true" />
                                                 <p ref={inputChars} className={`absolute bottom-[7px] left-[14px] mt-0 text-[10px] leading-none sm:left-[17px] sm:text-[11px] md:bottom-[9px] md:left-[22px] md:text-[12px] ${(editLesson && editLesson.length >= 30) ? 'text-red-300' : 'text-[#7f8996]'}`}>
                                                        0/10
                                                 </p>
                                          </div>
                                   </div>
                                   <div className="w-full font-iranisans mb-6" dir="rtl">

                                          <div className="mb-[20px] flex items-center gap-2">
                                                 <span className="h-6 w-[3px] rounded-full bg-yellow-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">توضیحات برچسب</h2>
                                          </div>

                                          <div className="relative">
                                                 <input
                                                        autoComplete="off"
                                                        onChange={e => setDescBadeg(e.target.value)}
                                                        defaultValue={descBadeg}
                                                        type="text"
                                                        placeholder="20 دقیقه تاخیر در شروع کلاس"
                                                        className="w-full h-[56px] rounded-[14px] border border-neutral-200 dark:border-[#3a424d] bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal text-neutral-500 dark:text-[#f6f7f9] outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                 />
                                                 <MdEdit className="pointer-events-none -mt-0.5 absolute left-[16px] top-1/2 h-5 w-5 -translate-y-1/2 sm:left-[19px] sm:h-6 sm:w-6 md:left-[25px] md:h-7 md:w-7 text-cyan-500 " aria-hidden="true" />
                                          </div>
                                   </div>
                                   <div className="w-full font-iranisans mb-2" dir="rtl">

                                          <div className="mb-[20px] flex items-center gap-2">
                                                 <span className="h-6 w-[3px] rounded-full bg-yellow-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px] ">تاریخ اعمال برچسب</h2>
                                          </div>

                                          <div className="py-1 w-full flex justify-start gap-x-10 items-center">
                                                 <div className="flex gap-x-2">
                                                        <label htmlFor="1">این هفته</label>
                                                        <input type="radio" name="okTime" id="1" onChange={() => setDateBadge(formatDatePlusDaysFrom(new Date().toLocaleDateString()))} />
                                                 </div>
                                                 <div className="flex gap-x-2">
                                                        <label htmlFor="2">هفته بعد</label>
                                                        <input type="radio" name="okTime" id="2" onChange={() => setDateBadge(formatDatePlusDaysFrom(new Date().toLocaleDateString(), 7))} />
                                                 </div>
                                                 <div className="flex gap-x-2">
                                                        <label htmlFor="3">همه هفته ها</label>
                                                        <input type="radio" defaultChecked name="okTime" id="3" onChange={() => setDateBadge("all")} />
                                                 </div>
                                          </div>
                                   </div>
                                   <button
                                          onClick={() => approvedBadge()}
                                          className="mt-6 w-full bg-yellow-500 py-1.5 text-center font-iranisans text-base text-black rounded-lg cursor-pointer"
                                   >
                                          تایید
                                   </button>
                            </div>
                     </Modal>
                     {/* DESCRIPTION MODAL */}
                     <Modal onClose={() => setOpenDescription(prev => !prev)} isOpen={openDescription} textTitle={`اطلاعات بیشتر درس ${modalTitle}`} state={1}>
                            <div className="w-full p-4 text-2xl font-iranisans space-y-4" dir="rtl">
                                   <>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">نام استاد : </p>
                                                 <p className="text-lg">{master}</p>
                                          </div>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">تعداد واحدتئوری  : </p>
                                                 <p className="text-lg">{toPersianDigit(allUnits.split("-")[0])}</p>
                                          </div>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">تعداد واحد عملی  : </p>
                                                 <p className="text-lg">{toPersianDigit(allUnits.split("-")[1])}</p>
                                          </div>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">تعداد کل واحد ها   : </p>
                                                 <p className="text-lg">{toPersianDigit(allUnits.split("-")[2])}</p>
                                          </div>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">تاریخ امتحان  : </p>
                                                 <p className="text-lg">{toPersianDigit(examDay)}</p>
                                          </div>
                                          <div className="flex gap-x-2">
                                                 <p className="dark:text-neutral-300 text-neutral-400 text-xl">زمان امتحان  : </p>
                                                 <p className="text-lg">{toPersianDigit(examTime)}</p>
                                          </div>
                                   </>
                            </div>
                     </Modal>
                     {/* EDIT PLAN MODAL */}
                     <Modal isOpen={openEditModal} onClose={() => setOpenEditModal(prev => !prev)} textTitle={`ویرایش درس ${modalTitle}`} state={4}>
                            <div
                                   className="w-full pt-4 text-[#f4f6f8]"
                                   dir="rtl"
                            >

                                   <div>
                                          {/* name */}
                                          <div className="w-full font-iranisans mb-[22px] sm:mb-[28px] md:mb-[38px]">
                                                 <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                        <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                        <h2 className="font-iranisans text-[18px] font-bold dark:text-[#f5f6f8] text-neutral-500 sm:text-[20px] md:text-[24px]">نام درس</h2>
                                                 </div>

                                                 <div className="relative">
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => seteditLesson(e.target.value)}
                                                               defaultValue={editLesson}
                                                               maxLength={30}
                                                               id="name"
                                                               type="text"
                                                               placeholder="برنامه سازی"
                                                               className="w-full h-[56px] rounded-[14px] border border-neutral-200 dark:border-[#3a424d] bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                        <HiOutlineBookOpen className="pointer-events-none absolute left-[16px] top-1/2 h-5 w-5 -translate-y-1/2 sm:left-[19px] sm:h-6 sm:w-6 md:left-[25px] md:h-7 md:w-7 text-cyan-500 stroke-[1.7]" aria-hidden="true" />
                                                        <p className={`absolute bottom-[7px] left-[14px] mt-0 text-[10px] leading-none sm:left-[17px] sm:text-[11px] md:bottom-[9px] md:left-[22px] md:text-[12px] ${(editLesson && editLesson.length >= 30) ? 'text-red-400' : 'text-[#7f8996]'}`}>
                                                               30/{editLesson ? editLesson.length : 0}
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* desc */}
                                          <div className="w-full font-iranisans mb-[28px] sm:mb-[34px] md:mb-[48px]">
                                                 <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                        <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                        <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">توضیحات</h2>
                                                 </div>

                                                 <div className="relative">
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => setEditDescription(e.target.value)}
                                                               defaultValue={editDescription}
                                                               id="name"
                                                               type="text"
                                                               placeholder="کلاس 1112 ، طبقه دوم"
                                                               className="w-full h-[56px] rounded-[14px] border border-neutral-200 dark:border-[#3a424d] bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                        <HiOutlineChatBubbleBottomCenterText className="pointer-events-none absolute left-[16px] top-1/2 h-5 w-5 -translate-y-1/2 sm:left-[19px] sm:h-6 sm:w-6 md:left-[25px] md:h-7 md:w-7 text-cyan-500 stroke-[1.7]" aria-hidden="true" />
                                                 </div>
                                          </div>

                                          {/* units section title */}
                                          <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                 <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">واحدها</h2>
                                          </div>

                                          {/* news  */}
                                          <div className="w-full font-iranisans my-0 grid grid-cols-3 gap-[8px] sm:gap-[12px] md:gap-[16px]">
                                                 {/* واحدتئوری */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineAcademicCap className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               واحد تئوری
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => {
                                                                      setEditTotalUnits(prev => {
                                                                             const tu = prev.split("-");
                                                                             tu[0] = e.target.value;
                                                                             return tu.join("-");
                                                                      })
                                                               }}
                                                               defaultValue={editTotalUnits && editTotalUnits.split("-")[0]}
                                                               maxLength={1}
                                                               id="name"
                                                               type="text"
                                                               placeholder="1"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>

                                                 {/* واحدعملی */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineBeaker className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               واحد عملی
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => {
                                                                      setEditTotalUnits(prev => {
                                                                             const tu = prev.split("-");
                                                                             tu[1] = e.target.value;
                                                                             return tu.join("-");
                                                                      })
                                                               }}
                                                               defaultValue={editTotalUnits && editTotalUnits.split("-")[1]}
                                                               maxLength={1}
                                                               id="name"
                                                               type="text"
                                                               placeholder="2"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>

                                                 {/* واحد ها */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineSquares2X2 className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               جمع واحدها
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => {
                                                                      setEditTotalUnits(prev => {
                                                                             const tu = prev.split("-");
                                                                             tu[2] = e.target.value;
                                                                             return tu.join("-");
                                                                      })
                                                               }}
                                                               defaultValue={editTotalUnits && editTotalUnits.split("-")[2]}
                                                               maxLength={1}
                                                               id="name"
                                                               type="text"
                                                               placeholder="1"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-12 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>
                                          </div>

                                          {/* exam section title */}
                                          <div className="mb-[14px] mt-[28px] flex items-center gap-2 sm:mb-[18px] sm:mt-[34px] md:mb-[23px] md:mt-[46px] md:gap-3">
                                                 <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">اطلاعات آزمون</h2>
                                          </div>

                                          {/* news  */}
                                          <div className="w-full font-iranisans my-0 grid grid-cols-3 gap-[8px] sm:gap-[12px] md:gap-[16px]">
                                                 {/* واحدتئوری */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineUser className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               استاد درس
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => setEditMasterName(e.target.value)}
                                                               defaultValue={editMasterName}
                                                               maxLength={15}
                                                               id="name"
                                                               type="text"
                                                               placeholder="م محمدی"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>

                                                 {/* واحدعملی */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               تاریخ آزمون
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => {
                                                                      setEditTotalUnits(prev => setEditExamDay(e.target.value))
                                                               }}
                                                               defaultValue={editExamDay}
                                                               maxLength={10}
                                                               id="name"
                                                               type="text"
                                                               placeholder="1404/01/01"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-4 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>

                                                 {/* واحد ها */}
                                                 <div className="w-full overflow-hidden rounded-[14px] border border-neutral-200 dark:border-[#39414c] bg-neutral-100 dark:bg-[#151b24] md:rounded-[18px]">
                                                        <label htmlFor="name" className="mb-0 flex h-[44px] items-center justify-center gap-1 border-b border-neutral-200 dark:border-[#39414c] px-[6px] text-[11px] font-medium leading-[1.4] text-neutral-500 dark:text-[#c9d0d8] sm:h-[50px] sm:gap-1.5 sm:px-[10px] sm:text-[13px] md:h-[68px] md:justify-start md:gap-2 md:px-[22px] md:text-[18px]">
                                                               <HiOutlineClock className="h-4 w-4 shrink-0 text-cyan-500 stroke-[1.7] sm:h-[18px] sm:w-[18px] md:h-6 md:w-6" aria-hidden="true" />
                                                               زمان آزمون
                                                        </label>
                                                        <input
                                                               autoComplete="off"
                                                               onChange={e => setEditExamTime(e.target.value)}
                                                               defaultValue={editExamTime}
                                                               maxLength={6}
                                                               id="name"
                                                               type="text"
                                                               placeholder="12:00"
                                                               className="w-full h-[56px] rounded-[14px] rounded-t-none bg-neutral-100 dark:bg-[#161c25] py-0 pr-4 pl-4 text-[16px] font-normal dark:text-[#f6f7f9] text-neutral-500 outline-none transition-all placeholder:text-[#6f7884] focus:border-[#74e89a] focus:ring-2 focus:ring-[#74e89a]/15 sm:h-[64px] sm:text-[18px] md:h-[86px] md:rounded-[18px] md:text-[25px]"
                                                        />
                                                 </div>
                                          </div>

                                          <div className="mt-6 mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                 <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">انتخاب روز هفته</h2>
                                          </div>

                                          {/* select box */}
                                          <div className="w-full font-iranisans sm:mt-[34px] md:mt-[40px]">
                                                 <div className="relative">
                                                        <HiOutlineCalendarDays className="pointer-events-none absolute right-[16px] top-1/2 z-10 h-5 w-5 -translate-y-1/2 sm:right-[19px] sm:h-6 sm:w-6 md:right-[24px] md:h-7 md:w-7 text-cyan-500 stroke-[1.7]" aria-hidden="true" />
                                                        <select
                                                               id="simple-select"
                                                               defaultValue={editSelectValue}
                                                               onChange={e => setEditSelectValue(e.target.value)}
                                                               className="block w-full h-[56px] appearance-none rounded-[14px] border border-neutral-200 dark:border-[#3a424d] bg-neutral-100 dark:bg-[#161c25] py-2 pr-[46px] pl-[44px] text-[16px] font-medium text-neutral-500 dark:text-[#f5f7f8] shadow-none outline-none sm:h-[64px] sm:pr-[52px] sm:pl-[50px] sm:text-[18px] md:h-[82px] md:rounded-[18px] md:pr-[66px] md:pl-[62px] md:text-[23px]"
                                                        >
                                                               <option value={0}>شنبه</option>
                                                               <option value={1}>یکشنبه</option>
                                                               <option value={2}>دوشنبه</option>
                                                               <option value={3}>سه شنبه</option>
                                                               <option value={4}>چهار شنبه</option>
                                                               <option value={5}>پنج شنبه</option>
                                                               <option value={6}>جمعه</option>
                                                        </select>
                                                        <HiOutlineChevronDown className="pointer-events-none absolute left-[16px] top-1/2 h-5 w-5 -translate-y-1/2 sm:left-[19px] sm:h-[22px] sm:w-[22px] md:left-[24px] md:h-6 md:w-6 text-[#dfe4e9] stroke-[1.8]" aria-hidden="true" />
                                                 </div>
                                          </div>
                                   </div>

                                   {/* time selector */}
                                   <div
                                          className="w-full h-auto mt-[28px] font-iranisans sm:mt-[34px] md:mt-[44px]
          [&_input]:h-[56px] [&_input]:rounded-[14px] [&_input]:border-[#39414c] [&_input]:bg-[#151b24] [&_input]:px-3 [&_input]:text-[16px] [&_input]:text-[#f7f8fa]
          [&_select]:h-[56px] [&_select]:rounded-[14px] [&_select]:border-[#39414c] [&_select]:bg-[#151b24] [&_select]:px-3 [&_select]:text-[16px] [&_select]:text-[#f7f8fa]
          [&_button]:min-h-[56px] [&_button]:rounded-[14px] [&_button]:text-[16px] [&_button]:font-iranisans [&_button]:transition-all
          sm:[&_input]:h-[62px] sm:[&_select]:h-[62px] sm:[&_button]:min-h-[62px] md:[&_input]:h-auto md:[&_select]:h-auto md:[&_button]:min-h-0"
                                   >
                                          <div className="mb-[14px] flex items-center gap-2 sm:mb-[18px] md:mb-[23px] md:gap-3">
                                                 <span className="h-6 w-[3px] rounded-full bg-cyan-500 md:h-8 md:w-[4px]" />
                                                 <h2 className="font-iranisans text-[18px] font-bold text-neutral-500 dark:text-[#f5f6f8] sm:text-[20px] md:text-[24px]">بازه زمانی کلاس</h2>
                                          </div>

                                          <TimeSelector
                                                 mood={4}
                                                 callback={e => {
                                                        //show empty error
                                                        if (!editLesson || !editDescription) {
                                                               notifyError("ابتدا فیلد ها رو پر کنید");
                                                               return;
                                                        }
                                                        //saving data
                                                        const data = {
                                                               start: e.from,
                                                               end: e.to,
                                                               day: editSelectValue,
                                                               lesson: editLesson,
                                                               description: editDescription,
                                                               hours: Counter(e.from, e.to).length,
                                                               id: Random((Get("plans") ?? [])),
                                                               master: editMasterName,
                                                               all_units: editTotalUnits,
                                                               exam_day: editExamDay,
                                                               exam_time: editExamTime
                                                        };

                                                        // console.log(data)
                                                        // return

                                                        //add plan
                                                        dispatch_Plan_Context({
                                                               type: PlanTypeContext.EDIT_PLAN,
                                                               planId: editPlanID,
                                                               editingData: data
                                                        })

                                                        setOpenEditModal(false);
                                                 }}
                                                 defaultStart={defaultStartTimeEditPlan}
                                                 defaultEnd={defaultEndTimeEditPlan}
                                          />
                                   </div>
                            </div>
                     </Modal>
                     {/* CONTENT */}
                     <div className="w-full relative">
                            {/* today */}
                            <h1 className="w-full border border-b-0 border-neutral-300 rounded-t-2xl py-3 text-center text-2xl font-morabba-bold bg-neutral-300 dark:bg-secondary dark:border-neutral-400 dark:text-white">
                                   {daysOfWeek[Number(day)]}
                                   <HamberMenu
                                          onClose={() => setOpenHamber(prev => !prev)}
                                          open={openHamber}
                                          className="absolute top-[18px] left-3"
                                   />
                            </h1>

                            {/* wattermark in pdf */}
                            {/* {
                         Get("download_pdf_handler") && (
                              <div
                                   style={{
                                        transform: "rotate(45deg)"
                                   }}
                                   className="absolute top-1/2 -translate-1/2 left-1/2 z-9999 text-4xl w-[20rem] pointer-events-none opacity-50">
                                   <p className="text-neutral-600 dark:text-neutral-400">dars-chin</p>
                              </div>
                         )
                    } */}

                            {/* plans */}
                            <div className="w-full flex" dir="rtl">

                                   {/* times */}
                                   <div className="w-1/6 border border-t-0 border-neutral-300 dark:border-neutral-400">
                                          {/* <div className="py-2 w-full"></div> */}
                                          {
                                                 settings.counter.map((item, index) => (
                                                        <div key={Math.random() * 10000} className={`relative h-12 border-t border-neutral-300 dark:border-neutral-400 flex justify-center items-center font-morabba dark:text-white`}>
                                                               <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 ${index === 0 ? "bg-quaternary dark:bg-neutral-500 h-12 w-13 max-xss:w-10 flex justify-center -top-4! my-shape" : "bg-quaternary dark:bg-neutral-500"}`}>{toPersianDigit(item)}</span>
                                                               {
                                                                      settings.counter.length === index + 1 && (
                                                                             <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-1 ${index === 0 ? "bg-transparent" : "bg-quaternary dark:bg-neutral-500"}`}>{Number(item + 1).toLocaleString("fa")}</span>
                                                                      )
                                                               }
                                                        </div>
                                                 ))
                                          }
                                   </div>
                                   {/* plans */}
                                   <div className="w-full border-t border-neutral-300 dark:border-neutral-400 font-iranisans">

                                          {
                                                 settings.counter.map(time => (
                                                        cuttedPlans.map(plan => (
                                                               (time === Number(plan.start) && Number(plan.day) === day) && (
                                                                      <div
                                                                             key={plan.id}
                                                                             style={{
                                                                                    height: ((plan.hours * 3)) + "rem"
                                                                             }}
                                                                             className={`${plan.lesson && "bg-green-100 dark:bg-neutral-400-50"} dark:text-white relative border border-t-0 border-r-0 border-neutral-300 dark:border-neutral-400 dark:border-b-neutral-400 flex flex-col justify-center items-center `}
                                                                      >
                                                                             {plan.lesson && (
                                                                                    <>
                                                                                           {/* hamber menu  */}
                                                                                           <div className={`${openHamber ? "w-32" : "w-0"} overflow-hidden flex transition-all h-8 absolute top-0 left-0`}>
                                                                                                  {/* options */}
                                                                                                  <div className="w-28 h-8 ">
                                                                                                         {/* delete plan */}
                                                                                                         <svg
                                                                                                                data-plan-id={plan.id}
                                                                                                                onClick={(e) => {
                                                                                                                       handleTitleModal(plan.id)
                                                                                                                       setDeleteID(e.currentTarget.dataset.planId);
                                                                                                                       setShowDeleteModal(prev => !prev);
                                                                                                                }}
                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                className="size-6 absolute top-1.5 left-4 stroke-red-600 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                                                <g>
                                                                                                                       <path id="Vector" d="M14 16H20M21 10V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V11C3 12.1046 3.89543 13 5 13H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                                </g>
                                                                                                         </svg>
                                                                                                         {/* badge create */}
                                                                                                         {
                                                                                                                plan.hours > 1 && (
                                                                                                                       <svg
                                                                                                                              onClick={() => {
                                                                                                                                     if (plan.badges && plan.badges.length >= 2) {
                                                                                                                                            notifyError("حداکثر 2 برچسب به هر درس میتوانید اضافه کنید");
                                                                                                                                            return;
                                                                                                                                     }
                                                                                                                                     handleTitleModal(plan.id)
                                                                                                                                     setIdBadge(plan.id);
                                                                                                                                     setOpenBadge(prev => !prev);
                                                                                                                              }}
                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                              className="size-5 absolute top-1.75 left-12 stroke-yellow-500 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                                                              <g>
                                                                                                                                     <path id="Vector" d="M5 17H8M8 17H11M8 17V14M8 17V20M14 21H15C16.1046 21 17 20.1046 17 19V5C17 3.89543 16.1046 3 15 3H13C11.8954 3 11 3.89543 11 5V11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                                              </g>
                                                                                                                       </svg>
                                                                                                                )
                                                                                                         }
                                                                                                         {/* edit plan */}
                                                                                                         <svg
                                                                                                                onClick={() => {
                                                                                                                       handleEditPlan(plan.id);
                                                                                                                       handleTitleModal(plan.id)
                                                                                                                }}
                                                                                                                className="size-4.5 absolute top-1.75 left-21 stroke-[#0072ff] cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                         </svg>
                                                                                                  </div>
                                                                                           </div>
                                                                                           {/* title */}
                                                                                           <p>{plan.lesson}</p>
                                                                                           <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-300">{toPersianDigit(plan.description)}</p>
                                                                                           {/* show info */}
                                                                                           <svg
                                                                                                  onClick={() => {
                                                                                                         setDescription(plan.description);
                                                                                                         setMaster(plan.master ?? "")
                                                                                                         setAllUnits(plan.all_units ?? "0-0-0")
                                                                                                         setExamDay(plan.exam_day ?? "")
                                                                                                         setExamTime(plan.exam_time ?? "")
                                                                                                         setOpenDescription(prev => !prev);
                                                                                                         handleTitleModal(plan.id)
                                                                                                  }}
                                                                                                  xmlns="http://www.w3.org/2000/svg" className={`${openHamber ? "left-30" : "left-2"} transition-all ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] size-5.5 absolute top-1.5 stroke-secondary cursor-pointer`} viewBox="0 0 24 24" fill="none">
                                                                                                  <g>
                                                                                                         <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                  </g>
                                                                                           </svg>
                                                                                           {/* badge show */}
                                                                                           {
                                                                                                  (plan.badges && !Get("download_pdf_handler")) && (
                                                                                                         <div
                                                                                                                style={{
                                                                                                                       transform: "rotate(270deg)"
                                                                                                                }}
                                                                                                                className="w-24 h-32 absolute top-1/2 -translate-y-1/2 right-6 flex flex-col justify-end gap-4 items-center overflow-hidden cursor-pointer">
                                                                                                                {
                                                                                                                       plan.badges.map(item => {
                                                                                                                              if (thisWeek.includes(item.date) || item.date === "all") return <Badge key={Math.random() * 100} description={item.description} title={item.name} badgeID={item.id} lessonID={plan.id} />
                                                                                                                       })
                                                                                                                }
                                                                                                         </div>
                                                                                                  )
                                                                                           }
                                                                                    </>
                                                                             )}

                                                                      </div>
                                                               )
                                                        ))
                                                 ))
                                          }
                                   </div>
                            </div>
                     </div>
              </>
       )
} 
