import { useState, useEffect, useRef, useCallback } from "react"
import Modal from "../components/Modal";
import TimeSelector from "../components/time-selector/TimePicker";
import { useSettings, SettingsContextTypes } from "../contexts/Settings";
import { notifyError, notifySuccess, notifyWarn } from "../utils/Tostify";
import { Add, Get, Del } from "../utils/Storage";
import { Link, useNavigate } from "react-router-dom";
import ParseUniversitySchedule from "../utils/ParseUniversitySchedule";
import { usePlans, PlanTypeContext } from "../contexts/Plans";
import downloadFile from "../utils/downloadFile"
import { getPermission, requestPermission } from "../utils/Notification";

function checkFileInput(inp) {
       filePicker.current.addEventListener("change", async (e) => {
              try {
                     const file = e.target.files[0];
                     let data = await file.text();
                     data = JSON.parse(data);
                     if (data.name !== "darschin") throw { code: 2, m: "فایل مربوط به درس چین نیست!" };
                     const userApproved = confirm("در صورت تایید، تمام برنامه های از قبل تعریف شده شما حذف و اطلاعات جدید جایگذین خواهد شد");
                     if (!userApproved) throw { code: 3, m: "عملیات لغو شد!" };
                     Add("plans", data.plans);
                     notifySuccess("موفقیت آمیز");
              } catch (e) {
                     switch (e.code) {
                            case 2: {
                                   notifyError(e.m);
                                   break;
                            }
                            case 3: {
                                   notifyError(e.m);
                                   break;
                            }
                            default: {
                                   notifyError("مشکل در دریافت داده!")
                            }
                     }
              }
       })
}

export default function Settings() {

       const tl = useRef(null)
       const ru = useRef(null)

       const [openSetting, setOpenSetting] = useState(false);
       const [opendownloader, setOpenDownloader] = useState(false);
       const [openCreatePlan, setOpenCreatePlan] = useState(false);
       const [textarea, setTextarea] = useState(null);
       const [vocationWeek, setVocationWeek] = useState(Get("vocation") ?? false)
       const [learn, setLearn] = useState({
              index: 0,
              text: ""
       });
       const [refreshForNotif, setRefreshForNotif] = useState(false)

       useEffect(() => {
              if (learn.index > 8) setLearn({ index: 0, text: "" })
       }, [learn.index])

       const filePicker = useRef();
       const redirect = useNavigate();

       const checkInputFile = useCallback(async (e) => {
              try {
                     const file = e.target.files[0];
                     let data = await file.text();
                     data = JSON.parse(data);
                     if (data.name !== "darschin") throw { code: 2, m: "فایل مربوط به درس چین نیست!" };
                     const userApproved = confirm("در صورت تایید، تمام برنامه های از قبل تعریف شده شما حذف و اطلاعات جدید جایگذین خواهد شد");
                     if (!userApproved) throw { code: 3, m: "عملیات لغو شد!" };
                     Add("plans", data.plans);
                     notifySuccess("موفقیت آمیز. درحال برگشت به صفحه برنامه ها ...");
                     setTimeout(() => {
                            window.location.href = "/darschin/plans"
                     }, 1000)
              } catch (e) {
                     switch (e.code) {
                            case 2: {
                                   notifyError(e.m);
                                   break;
                            }
                            case 3: {
                                   notifyError(e.m);
                                   break;
                            }
                            default: {
                                   notifyError("مشکل در دریافت داده!")
                            }
                     }
              }
       })

       const { dispatch_Plan_Context } = usePlans();
       const { settings, dispatch } = useSettings();

       const refreshDesc = (index) => {
              switch (index) {
                     case 1: return "دانشجویان دانشگاه ملی مهارت میتوانند صرفا با کپی و پیست برنامه خود از سایت بوستان در این بخش ، برنامه خود را بصورت خودکار بسازند"
                     case 2: return "امکان شخصی‌سازی تایم روز مطابق انتخاب واحد شما (بصورت پیشفرض ساعت شروع کلاس ها از 8 تا 20 تنظیم شده است )"
                     case 3: return "پشتیبانی از حالت روشن و تاریک، سازگار با شرایط نوری مختلف"
                     case 4: return "دریافت برنامه درسی در قالب های مختلف (عکس یا پی دی اف) همچنین میتونید با یکبار انلاین شدن بصورت افلاین از درس چین استفاده کنید (جهت دسترسی بهتر میتونید در قالب اپلیکیشن روی موبایل هم نصب کنید)"
                     case 5: return "میتونید از درس هایی که اضافه کردید خروجی بگیرید تا روی یک دستگاه دیگه هم درس ها تون رو داشته باشید"
                     case 6: return "با وارد کردن خروجی ای که از درس چین گرفتید به راحتی درس هاتون رو اضافه کنید"
                     case 7: return "کاربرانی که در روز های پنج شنبه و جمعه کلاسی ندارند میتونند این روز ها رو از برنامه شون حذف کنند "
                     case 8: return ""
                     default: return ""
              }
       }
       const pdfDownloadHandler = () => {
              const toastLoadID = notifyWarn("عملیات درحال انجام.لطفا صبر کنید");
              Add("download_pdf_handler", toastLoadID);
              redirect("/plans");
       }
       const pngDownloadHandler = () => {
              const toastLoadID = notifyWarn("عملیات درحال انجام.لطفا صبر کنید");
              Add("download_png_handler", toastLoadID);
              redirect("/plans");
       }
       const ExportPlansHandler = () => {
              const file = {
                     name: "darschin",
                     plans: Get("plans")
              }
              const blob = new Blob([JSON.stringify(file)], { type: "application/json" })
              const url = URL.createObjectURL(blob);
              downloadFile(url, "json");
              URL.revokeObjectURL(url);
              notifySuccess("فایل دانلود شد.")
       }
       const importPlansHandler = useCallback(() => {
              if (filePicker.current == null) return;
              filePicker.current.click()
              filePicker.current.addEventListener("change", checkInputFile)
       })
       const setPermission = () => {
              console.log(getPermission())
              switch (getPermission()) {
                     case "denied": {
                            return "دسترسی مسدود شده ❌"
                     }
                     case "granted": {
                            return "دسترسی داده شده ✔"
                     }
                     default: {
                            return "در انتظار دسترسی ⏳"
                     }
              }
       }

       const generator = () => {
              if (!textarea) {
                     notifyError("ورودی خالیه!");
                     return;
              }
              const data = ParseUniversitySchedule(textarea, (e) => {
                     switch (e) {
                            case "INVALID_DATA": {
                                   notifyError("دیتای ورودی نا معتبره!");
                                   return;
                            }
                            case "INCORRECT_FORMAT": {
                                   notifyError("فرمت وروردی صحیح نیست . لطفا طبق آموزش پیش برید!");
                                   return;
                            }
                     }
              })
              if (!data) return false;
              Del("plans");
              dispatch_Plan_Context({
                     type: PlanTypeContext.ADD_FULL_DATA_PLAN,
                     fullData: Object.values(data)
              })
              notifySuccess("عملیات موفقیت آمیز 👌");
              setOpenCreatePlan(false);
              setTextarea(null)
              // console.log(convertToArray);
       }

       const setVocationStatus = () => {
              if (vocationWeek) {
                     Add("vocation", !vocationWeek);
              }
              else {
                     Add("vocation", !vocationWeek);
              }
              setVocationWeek(prev => !prev);
       }

       const [mode, setMode] = useState(Get("them") ?? "light");
       useEffect(() => {
              if (mode === "dark") {
                     document.body.classList.remove("light")
                     document.body.classList.add("dark");
              } else if (mode === "light") {
                     document.body.classList.remove("dark")
                     document.body.classList.add("light");
              }
       }, [mode]);

       return (
              <div className="w-full mt-40">
                     {/* bg blur {for leran} */}
                     <div style={{ display: learn.index ? "block" : "none" }} className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-99">
                            {/* description */}
                            <div
                                   className={`${learn.index === 8 && "top-1/2 -translate-y-1/2"} relative text-sm text-center pt-6 pb-8 px-4 bg-neutral-100 rounded-xl m-8 font-iranisans z-999`} dir="rtl"
                            >
                                   {
                                          learn.index === 8 && (
                                                 <>
                                                        <h3 className="text-xl mb-6">نکات تکمیلی مهم</h3>
                                                        <p>
                                                               <span className="text-red-400">کلاس های دو پارتی (به عنوان مثال یکشنبه 10-14 ، 15-17 ) در حالت خودکار در بخش مختص دانشجویان ملی مهارت تنها پارت اول کلاس افزوده میشود و پارت دوم را باید دستی وارد کنید. </span>
                                                               برای افزودن دستی درس جدید از منو گزینه "افزودن درس جدید" رو انتخاب کنید.
                                                        </p>
                                                        <p className="mt-1">در حین استفاده از برنامه اگر به مشکلی برخوردید حتما به ایدی پشتیبانی در تلگرام (@mbhdev) اطلاع رسانی کنید</p>
                                                 </>
                                          )
                                   }
                                   {learn.text}
                                   {/* next btn */}
                                   <button onClick={() => setLearn(prev => ({ text: refreshDesc(prev.index + 1), index: prev.index + 1 }))} className="absolute bottom-1 left-2 text-cyan-500 cursor-pointer" >بعدی <span className="rotate-180 inline-block">&#10170;</span></button>
                            </div>

                     </div>
                     {/* question mask {for learn} */}
                     <div
                            onClick={() => setLearn({ text: refreshDesc(1), index: 1 })}
                            className="size-12 cursor-pointer animate-bounce rounded-full bg-[#ff9933] shadow-[0px_0px_12px_2px_#ff9933] absolute bottom-2 left-2"
                     >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 400 400" fill="none" class="mdl-js">
                                   <path d="M142 125.853C155.049 97.8883 180.62 82.7645 200.381 78.4757C227.189 72.6575 249.859 84.0511 257.624 112.528C260.302 122.352 259.217 138.128 253.081 148.517C247.426 158.092 239.904 165.942 227.555 176.481C225.251 178.447 217.389 185.018 216.649 185.643C199.849 199.818 191.567 209.152 186.81 220.972C182.053 232.792 182.305 269.489 216.649 266.35" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                                   <path d="M198.744 315.68C198.744 317.274 198.744 319.614 198.744 322.7" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                     </div>
                     {/* svg box */}
                     <div className="absolute top-1 right-0 w-full h-52 flex justify-center items-center">
                            <img src="/darschin/images/title_shape/title_shape_orange.png" className="w-full h-full" alt="" />
                            <p className="absolute text-2xl font-morabba-bold">تنظیمات</p>
                     </div>
                     {/* content */}
                     <div className="w-full font-iranisans font-[500] space-y-8 ">
                            {/* create plan automatically */}
                            <div
                                   style={learn.index === 1 ? {
                                          position: "relative",
                                          zIndex: 102
                                   } : {}}
                                   className="flex flex-col justify-center items-center">
                                   <button
                                          dir="rtl"
                                          className="w-8/10 cursor-pointer bg-[#ff9933] shadow-yellow-500/50 shadow-xl p-2 rounded-lg"
                                          onClick={() => setOpenCreatePlan(prev => !prev)}
                                   >
                                          <p className="text-xl mb-1">افزودن خودکار درس ها</p>
                                          <p className="text-base">(مخصوص دانشجویان دانشگاه ملی مهارت)</p>
                                   </button>
                                   <Modal isOpen={openCreatePlan} onClose={() => setOpenCreatePlan(prev => !prev)}>
                                          <div className="w-full font-iranisans text-center">
                                                 <h1 className="text-2xl py-4">افزودن خودکار درس ها</h1>
                                                 <div className="mt-4">
                                                        <p>طبق آموزش زیر (حتما با کامپیوتر) و از بخش "چاپ انتخاب واحد" در سایت بوستان ، برنامه خود تون رو کپی و در باکس زیر جایگذاری کنید </p>
                                                        <p className="text-red-400 font-semibold">نکته مهم : تمام دیتای از پیش وارد شده حذف و باز نویسی میشوند - از فایل پی دی اف کپی نکنید ، فقط از سایت و بخش چاپ انتخاب واحد کپی کنید</p>
                                                        <div className="w-full h-28 border border-black mt-4 overflow-hidden rounded-lg relative">
                                                               <svg
                                                                      onClick={() => {
                                                                             window.open(`${window.location.origin}/darschin/images/LearnSelected.gif`, "_blank");
                                                                      }}
                                                                      xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 rounded-lg size-10 backdrop-blur-xs p-1 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                      <path d="M4 15V18C4 19.1046 4.89543 20 6 20H9M15.2173 20H18C19.1046 20 20 19.1046 20 18V15M20 9V6C20 4.89543 19.1046 4 18 4H15M4 9V6C4 4.89543 4.89543 4 6 4H9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                               </svg>
                                                               <img className="w-full h-full" src="/darschin/images/LearnSelected.gif" alt="" />
                                                        </div>
                                                        <div className="w-full flex mt-6 gap-x-2" dir="rtl">
                                                               <textarea
                                                                      onChange={(e) => setTextarea(e.target.value)}
                                                                      defaultValue={textarea}
                                                                      placeholder="برنامتونو اینجا جایگذاری کنید"
                                                                      className="w-9/10 h-32 border rounded-lg py-2 px-3" dir="rtl"
                                                               ></textarea>
                                                               <div
                                                                      onClick={generator}
                                                                      className="w-1/10 h-32 cursor-pointer rounded-lg px-2 text-sm flex justify-center items-center bg-green-400 dark:bg-green-700/80">
                                                                      <p className="leading-6">برو که رفتیم</p>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </Modal>
                            </div>
                            {/* change settings */}
                            <div
                                   style={learn.index === 2 ? {
                                          position: "relative",
                                          zIndex: 102
                                   } : {}}
                                   className="flex flex-col justify-center items-center"
                            >
                                   <button className="w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-2 rounded-lg" onClick={() => setOpenSetting(prev => !prev)}>تنظیم تایم روز</button>
                                   <Modal isOpen={openSetting} onClose={() => setOpenSetting(prev => !prev)}>
                                          <div className="w-full rounded-xl bg-white dark:bg-neutral-600 mx-auto">
                                                 <h1 className="w-full py-6 text-center font-morabba-bold text-2xl">تنظیم تایم روز</h1>
                                                 <div className="w-full h-50 ">
                                                        <TimeSelector
                                                               callback={(e) => {
                                                                      dispatch({ type: SettingsContextTypes.CHANGE_HOURS, startHour: e.from, endHour: e.to });
                                                                      setOpenSetting(false);
                                                                      notifySuccess("عملیات موفقیت آمیز بود");
                                                               }}
                                                               defaultStart={settings.startHour}
                                                               defaultEnd={settings.endHour}
                                                        />
                                                 </div>
                                          </div>
                                   </Modal>
                            </div>
                            {/* change them mode */}
                            <div
                                   style={learn.index === 3 ? {
                                          position: "relative",
                                          zIndex: 102
                                   } : {}}
                                   className="flex flex-col justify-center items-center"
                            >

                                   {/* change mode */}
                                   <button
                                          onClick={() => {
                                                 setMode(prev => prev === "light" ? "dark" : "light");
                                                 Add("them", mode === "light" ? "dark" : "light");
                                          }}
                                          dir="rtl"
                                          className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-1 text-lg rounded-lg gap-x-2 flex justify-center items-center"
                                   >
                                          تغییر مود
                                          <span className="w-12 h-10 overflow-hidden">
                                                 <svg
                                                        style={{
                                                               transform: mode === "light" ? "translateY(0px)" : "translateY(-40px)"
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-all" viewBox="0 0 24 24" fill="none">
                                                        <path d="M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M12 2V4" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M12 20V22" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M4 12L2 12" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M22 12L20 12" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M19.7778 4.22266L17.5558 6.25424" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M4.22217 4.22266L6.44418 6.25424" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M6.44434 17.5557L4.22211 19.7779" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M19.7778 19.7773L17.5558 17.5551" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                                 </svg>
                                                 <svg
                                                        style={{
                                                               transform: mode === "light" ? "translateY(0px)" : "translateY(-40px)"
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-all" viewBox="0 0 24 24" fill="none">
                                                        <path className="fill-neutral-100" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM7.37554 20.013C7.017 19.8056 6.5582 19.9281 6.3508 20.2866C6.14339 20.6452 6.26591 21.104 6.62446 21.3114L7.37554 20.013ZM2.68862 17.3755C2.89602 17.7341 3.35482 17.8566 3.71337 17.6492C4.07191 17.4418 4.19443 16.983 3.98703 16.6245L2.68862 17.3755ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447ZM12 21.25C10.3139 21.25 8.73533 20.7996 7.37554 20.013L6.62446 21.3114C8.2064 22.2265 10.0432 22.75 12 22.75V21.25ZM3.98703 16.6245C3.20043 15.2647 2.75 13.6861 2.75 12H1.25C1.25 13.9568 1.77351 15.7936 2.68862 17.3755L3.98703 16.6245Z" />
                                                 </svg>
                                          </span>
                                   </button>
                            </div>
                            {/* download pdf */}
                            <div
                                   style={learn.index === 4 ? {
                                          position: "relative",
                                          zIndex: 102
                                   } : {}}
                                   className="flex flex-col justify-center items-center"
                            >
                                   <button
                                          dir="rtl"
                                          className="w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/30 shadow-xl py-2 rounded-lg "
                                          onClick={() => setOpenDownloader(prev => !prev)}
                                   >
                                          دانلود لیست تمام درس ها
                                   </button>
                                   <Modal isOpen={opendownloader} onClose={() => setOpenDownloader(prev => !prev)}>
                                          <div className="w-full rounded-xl bg-white dark:bg-neutral-600 mx-auto">
                                                 <h1 className="w-full py-4 text-center font-morabba-bold text-xl">قالب فایل دریافتی رو انتخاب کنید</h1>
                                                 <h5 className="w-full pb-2 text-center font-morabba text-sm text-red-600">برای دانلود بدون مشکل فایل ها ¹ باید دسترسی به اینترنت داشته باشید ² گیتهاب وصل باشه (نت ملی نباشه)</h5>
                                                 <div className="w-full flex justify-center items-center gap-x-8 h-60 mt-4">
                                                        {/* png */}
                                                        <div className="w-full h-full border-3 border-neutral-400 shadow-2xl rounded-2xl" onClick={pngDownloadHandler}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-neutral-400 dark:stroke-neutral-300" viewBox="0 0 24 24" fill="none">
                                                                      <path d="M4 4C4 3.44772 4.44772 3 5 3H14H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.41421V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="" strokeWidth="1" strokeLinecap="round" />
                                                                      <path d="M20 8H15V3" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M6.5 17V15.5M6.5 15.5V13L7.25 13C7.94036 13 8.5 13.5596 8.5 14.25V14.25C8.5 14.9404 7.94036 15.5 7.25 15.5H6.5Z" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M17 13H16C15.4477 13 15 13.4477 15 14V16C15 16.5523 15.4477 17 16 17H16.5C17.0523 17 17.5 16.5523 17.5 16V15.5" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M17 15.5H17.5" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M10.5 17V13L13 17V13" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                               </svg>
                                                        </div>
                                                        {/* pdf */}
                                                        <div className="w-full h-full border-3 border-neutral-400 shadow-2xl rounded-2xl" onClick={pdfDownloadHandler}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-neutral-400 dark:stroke-neutral-300" viewBox="0 0 24 24" fill="none" >
                                                                      <path d="M4 4C4 3.44772 4.44772 3 5 3H14H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.41421V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="" strokeWidth="1" strokeLinecap="round" />
                                                                      <path d="M20 8H15V3" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M11.5 13H11V17H11.5C12.6046 17 13.5 16.1046 13.5 15C13.5 13.8954 12.6046 13 11.5 13Z" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M15.5 17V13L17.5 13" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M16 15H17" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M7 17L7 15.5M7 15.5L7 13L7.75 13C8.44036 13 9 13.5596 9 14.25V14.25C9 14.9404 8.44036 15.5 7.75 15.5H7Z" stroke="" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                               </svg>
                                                        </div>
                                                 </div>
                                          </div>
                                   </Modal>
                            </div>
                            {/* notification */}
                            {/* <div
                                   className="flex flex-col justify-center items-center"
                            >
                                   <button
                                          dir="rtl"
                                          className="w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/30 shadow-xl py-2 rounded-lg "
                                          onClick={async () => {
                                                 const x = await requestPermission()
                                                 setRefreshForNotif(prev => !prev)
                                          }}
                                   >
                                          {
                                                 getPermission() === "granted" ? "اعلان درس فعاله" : "اعلان درس غیرفعاله "
                                          }
                                          &nbsp;
                                          <span>({setPermission()})</span>
                                   </button>
                            </div> */}
                            {/* export / import */}
                            <div className="flex justify-center items-center px-13 gap-x-4">
                                   <button
                                          style={learn.index === 5 ? {
                                                 position: "relative",
                                                 zIndex: 102
                                          } : {}} onClick={() => ExportPlansHandler()} className=" w-full text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-2 rounded-lg">خروجی گرفتن</button>
                                   <button
                                          style={learn.index === 6 ? {
                                                 position: "relative",
                                                 zIndex: 102
                                          } : {}} onClick={() => importPlansHandler()} className=" w-full text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-2 rounded-lg">وارد کردن</button>
                                   <input type="file" className="hidden" ref={filePicker} accept=".json" />
                            </div>
                            {/* enable/disable vocations */}
                            <div
                                   style={learn.index === 7 ? {
                                          position: "relative",
                                          zIndex: 102
                                   } : {}}
                                   className="flex flex-col justify-center items-center"
                            >
                                   {/* set vocation*/}
                                   <button
                                          dir="rtl"
                                          className={`${Get("vocation") ? "border-green-500 text-green-700 shadow-green-500/50" : "border-red-500 text-red-600 shadow-red-500/50"} mb-8 border w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg`}
                                          onClick={setVocationStatus}
                                   >
                                          {Get("vocation") ? "پنج‌شنبه و جمعه فعاله" : "پنج‌شنبه و جمعه غیر فعاله"}
                                   </button>
                            </div>
                            <div className="py-6"></div>
                     </div>
                     {/* creator detail */}
                     <div className="absolute bottom-0 right-2 py-2 flex gap-2" dir="ltr">
                            <span
                                   onClick={e => {
                                          // console.log(tl.current.style.width)
                                          if (tl.current.style.width === "48px" || tl.current.style.width === "") {
                                                 tl.current.style.width = "120px"
                                          } else {
                                                 tl.current.style.width = "48px"
                                          }
                                   }}
                                   className="px-1 flex items-center border rounded-full size-12 border-neutral-300 transition-[width] overflow-hidden" ref={tl}>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="min-w-12 min-h-12 -ms-1" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48" viewBox="0 0 2000 2000" >
                                          <path fillRule="nonzero" fill="#2a85f5" fillOpacity="1" d="M 770.160156 1060.738281 L 595.40625 1003.789062 C 595.40625 1003.789062 574.546875 995.320312 581.246094 976.109375 C 582.628906 972.140625 585.417969 968.769531 593.761719 962.960938 C 632.492188 935.96875 1310.519531 692.261719 1310.519531 692.261719 C 1310.519531 692.261719 1329.671875 685.808594 1340.980469 690.101562 C 1346.148438 692.058594 1349.449219 694.269531 1352.230469 702.371094 C 1353.238281 705.308594 1353.828125 711.570312 1353.75 717.789062 C 1353.699219 722.28125 1353.140625 726.441406 1352.738281 732.960938 C 1348.609375 799.589844 1225.050781 1296.871094 1225.050781 1296.871094 C 1225.050781 1296.871094 1217.660156 1325.96875 1191.171875 1326.960938 C 1181.511719 1327.320312 1169.78125 1325.371094 1155.769531 1313.308594 C 1103.789062 1268.589844 924.105469 1147.839844 884.402344 1121.28125 C 882.167969 1119.789062 881.527344 1117.839844 881.148438 1115.941406 C 880.589844 1113.140625 883.632812 1109.671875 883.632812 1109.671875 C 883.632812 1109.671875 1196.5 831.570312 1204.820312 802.378906 C 1205.46875 800.121094 1203.050781 799.011719 1199.769531 799.980469 C 1178.980469 807.628906 818.757812 1035.089844 779.003906 1060.210938 C 776.679688 1061.679688 770.160156 1060.738281 770.160156 1060.738281 " />
                                   </svg>
                                   <p className="text-xs text-blue-400 dark:text-blue-200 min-w-48">@mbhdev</p>
                            </span>
                            <span
                                   onClick={e => {
                                          // console.log(ru.current.style.width)
                                          if (ru.current.style.width === "48px" || ru.current.style.width === "") {
                                                 ru.current.style.width = "120px"
                                          } else {
                                                 ru.current.style.width = "48px"
                                          }
                                   }
                                   }
                                   className="px-1 flex items-center border rounded-full size-12 border-neutral-300 transition-[width] overflow-hidden gap-4" ref={ru}>
                                   <img src="images/logo-rubika.png" className="min-w-5 w-5 ms-2.25" alt="" />
                                   <p className="text-xs text-green-400 dark:text-green-200 min-w-5 -ms-0.75">@mbhrdev</p>
                            </span>
                     </div>
              </div>
       )
}
