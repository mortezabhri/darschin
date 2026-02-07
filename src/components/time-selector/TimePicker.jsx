import { memo, useEffect, useRef, useState } from "react"
import styles from "./time.module.css"
import "../../main.css"
import { notifySuccess, notifyError } from "../../utils/Tostify";
// import { useSettings, SettingsContextTypes } from "../../contexts/Settings";

const TimePicker = memo(({ callback, defaultStart, defaultEnd }) => {

     // const { settings, dispatch } = useSettings();
     const selectors = useRef(null);
     const fromSelector = useRef(null);
     const toSelector = useRef(null);
     const container = useRef(null);
     const from = useRef(null);
     const to = useRef(null);
     const fromHoursList = useRef(null);
     // const fromMinuteList = useRef(null);
     const toHoursList = useRef(null);
     // const toMinuteList = useRef(null);
     const fromMinAndHour = useRef({
          min: 0,
          hour: defaultStart
     });
     const toMinAndHour = useRef({
          min: 0,
          hour: defaultEnd
     });
     // const [showBtn, setShowBtn] = useState(false);


     function createTimeList(element, range, forWhat, step = 1) {
          for (let i = 0; i < range; i += step) {
               const li = document.createElement("li");
               li.textContent = i.toString().padStart(2, "0");
               li.classList.add(forWhat)
               li.addEventListener("click", () => selectItem(element, li));
               element.appendChild(li);
          }
          selectItem(element, element.children[0]); // default : 00:00
     }
     function selectItem(parent, item) {
          Array.from(parent.children).forEach(li => li.classList.remove("selected"));
          item.classList.add("selected");
          if (item.classList.contains("fromMinutes")) fromMinAndHour.current.min = item.textContent
          if (item.classList.contains("fromHours")) fromMinAndHour.current.hour = item.textContent
          if (item.classList.contains("toMinutes")) toMinAndHour.current.min = item.textContent
          if (item.classList.contains("toHours")) toMinAndHour.current.hour = item.textContent
          const index = Array.from(parent.children).indexOf(item);
          parent.style.transform = `translateY(${-index * 64}px)`;
     }
     function scrollHandler(event, element) {
          // event.preventDefault();
          let items = Array.from(element.children);
          let selectedIndex = items.findIndex(li => li.classList.contains("selected"));

          if (event.deltaY > 0 || event.key === "ArrowDown") {
               if (selectedIndex < items.length - 1) selectItem(element, items[selectedIndex + 1]);
          } else if (event.deltaY < 0 || event.key === "ArrowUp") {
               if (selectedIndex > 0) selectItem(element, items[selectedIndex - 1]);
          }
     }
     function checkDates() {
          const report = {
               body: "EVERY THING IS FINE",
               status: true
          };
          if (fromMinAndHour.current.hour === "00") {
               fromMinAndHour.current.hour = defaultStart
          }
          if (toMinAndHour.current.hour === "00") {
               toMinAndHour.current.hour = defaultEnd
          }
          // console.log(fromMinAndHour.current.hour, toMinAndHour.current.hour)
          const firstDate = new Date(`2025-01-01T${fromMinAndHour.current.hour}:00`);
          const secondDate = new Date(`2025-01-01T${toMinAndHour.current.hour}:00`);
          if (secondDate <= firstDate) {
               report.body = "\'FROM\' SHOULD LESS THEN \'TO\' , OR NOT EQUAL";
               report.status = false;
               return report;
          }
          return report;
     }

     const removeScrolling = useRef(null)

     // touching
     function addTouchSwipe(element) {
          let startY = 0;

          element.addEventListener("touchstart", (event) => {
               startY = event.touches[0].clientY;
          });

          element.addEventListener("touchmove", (event) => {
               let deltaY = event.touches[0].clientY - startY;

               if (deltaY > 20) {
                    scrollHandler({ deltaY: -1 }, element);
                    startY = event.touches[0].clientY;
               } else if (deltaY < -20) {
                    scrollHandler({ deltaY: 1 }, element);
                    startY = event.touches[0].clientY;
               }
          });
     }

     const fadeToggle = (hidding, showing, StyleDisplayShowing = "block") => {
          // setShowBtn(true)
          let hiddingElem;
          let showingElem;
          if (hidding && showing) {
               hiddingElem = hidding.current
               showingElem = showing.current
          } else {
               console.warn("EMPTY FADING ?!")
               return false;
          }
          hiddingElem.style.transition = "all 300ms ease";
          hiddingElem.style.opacity = 0;
          setTimeout(() => {
               hiddingElem.style.display = "none";
               showingElem.style.display = StyleDisplayShowing
               showingElem.style.opacity = 0;
               showingElem.style.transition = "all 200ms ease";
               setTimeout(() => showingElem.style.opacity = 1, 100);
          }, 200);
     }

     const approvedFromTime = () => {
          fadeToggle(from, selectors, "flex");
          fromSelector.current.textContent = `${fromMinAndHour.current.hour}:00`
     }
     const approvedToTime = () => {
          fadeToggle(to, selectors, "flex");
          // toSelector.current.textContent = `${toMinAndHour.current.hour}:${toMinAndHour.current.min}`
          toSelector.current.textContent = `${toMinAndHour.current.hour}:00`
     }

     const ok = () => {
          //EVERYTHING OK...
          const message = checkDates();
          if (!message.status) {
               notifyError("تاریخ پایان باید بیشتر از تاریخ شروع باشه :))")
               return;
          }
          callback({
               from: `${fromMinAndHour.current.hour}`,
               to: `${toMinAndHour.current.hour}`
          });
     }

     useEffect(() => {
          createTimeList(fromHoursList.current, 24, "fromHours");
          // createTimeList(fromMinuteList.current, 60, "fromMinutes");
          createTimeList(toHoursList.current, 24, "toHours");
          // createTimeList(toMinuteList.current, 60, "toMinutes");

          addTouchSwipe(fromHoursList.current);
          // addTouchSwipe(fromMinuteList.current);
          addTouchSwipe(toHoursList.current);
          // addTouchSwipe(toMinuteList.current);

          // console.log(removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden")

     }, [])

     return (
          <>
               <section className="w-full select-none" style={{ fontFamily: "cursive" }} ref={removeScrolling}>
                    <div className="w-full relative" ref={container}>
                         {/* selectors */}
                         <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 relative mb-10 mt-4" ref={selectors} dir="rtl">
                              <div className="w-full border border-neutral-300 px-6 py-3 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 dark:text-white relative" onClick={() => fadeToggle(selectors, from, "flex")}>
                                   <h6 className="inline bg-white dark:bg-neutral-700 absolute right-2 -bottom-2 text-base !font-iranisans dark:text-white">شروع</h6>
                                   <p ref={fromSelector} dir="ltr">{defaultStart}</p>
                              </div>
                              <div className="w-full border border-neutral-300 px-6 py-3 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 dark:text-white relative" onClick={() => fadeToggle(selectors, to, "flex")}>
                                   <h6 className="inline bg-white dark:bg-neutral-700 absolute right-2 -bottom-2 text-base font-iranisans dark:text-white">پایان</h6>
                                   <p ref={toSelector} dir="ltr">{defaultEnd}</p>
                              </div>


                              <button className="w-9/10 font-iranisans px-2 py-1 mx-12 text-sm border absolute -bottom-12 rounded-md text-center bg-green-200 text-black dark:text-black cursor-pointer" onClick={ok}>
                                   تایید تایم
                              </button>


                         </div>
                         {/* choose from */}
                         <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 relative" style={{ display: "none" }} ref={from}>
                              <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                   <h6 className="inline text-neutral-800 bg-white dark:text-white dark:bg-neutral-700 absolute right-2 -bottom-2.5 px-1 text-base font-iranisans">ساعت</h6>
                                   <div
                                        className="w-full h-48 overflow-hidden -mt-19 py-22"
                                        onMouseOver={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden";
                                        }}
                                        onTouchStart={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden";
                                        }}
                                        //moving end
                                        onMouseLeave={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "auto";
                                        }}
                                        onTouchEnd={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "auto";
                                        }}
                                   >
                                        <ul ref={fromHoursList} onWheel={(event) => scrollHandler(event, fromHoursList.current)} className={` ${styles.scrollList} scrollList ${document.body.classList.contains("dark") ? "text-white-ul" : "text-black-ul"} flex flex-col gap-y-8 `}></ul>
                                   </div>
                              </div>
                              {/* <div>
                                                 <p className="text-4xl">:</p>
                                          </div> */}
                              {/* <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute right-2 -bottom-2 text-base font-iranisans">دقیقه</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={fromMinuteList} onWheel={(event) => scrollHandler(event, fromMinuteList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div> */}
                              <div className="absolute -bottom-22 flex w-full gap-x-2 text-neutral-800" dir="rtl">
                                   <button className="font-iranisans w-7/10 px-2 py-1 text-sm border rounded-md text-center bg-green-200 cursor-pointer" onClick={approvedFromTime}>
                                        تایید تایم شروع
                                   </button>
                                   <button className="font-iranisans w-2/10 px-2 py-1 text-sm border rounded-md text-center bg-red-200 cursor-pointer" onClick={() => fadeToggle(from, selectors, "flex")}>
                                        منصرف شدم
                                   </button>
                              </div>
                         </div>
                         {/* choose to */}
                         <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 " style={{ display: "none" }} ref={to}>
                              <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                   <h6 className="inline text-neutral-800 bg-white dark:text-white dark:bg-neutral-700 absolute right-2 -bottom-2 text-base font-iranisans">ساعت</h6>
                                   <div
                                        className="w-full h-48 overflow-hidden -mt-19 py-22"
                                        //moving start
                                        onMouseOver={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden";
                                        }}
                                        onTouchStart={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden";
                                        }}
                                        //moving end
                                        onMouseLeave={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "auto";
                                        }}
                                        onTouchEnd={() => {
                                             removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "auto";
                                        }}
                                   >
                                        <ul ref={toHoursList} onWheel={(event) => scrollHandler(event, toHoursList.current)} className={` ${styles.scrollList} scrollList ${document.body.classList.contains("dark") ? "text-white-ul" : "text-black-ul"} flex flex-col gap-y-8`}></ul>
                                   </div>
                              </div>
                              {/* <div>
                                                 <p className="text-4xl">:</p>
                                          </div> */}
                              {/* <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute right-2 -bottom-2 text-base font-iranisans">دقیقه</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={toMinuteList} onWheel={(event) => scrollHandler(event, toMinuteList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div> */}
                              <div className="absolute -bottom-22 flex w-full gap-x-2 text-neutral-800" dir="rtl">
                                   <button className="font-iranisans w-7/10 px-2 py-1 text-sm border rounded-md text-center bg-green-200 cursor-pointer" onClick={approvedToTime} >
                                        تایید تایم پایان
                                   </button>
                                   <button className="font-iranisans w-2/10 px-2 py-1 text-sm border rounded-md text-center bg-red-200 cursor-pointer" onClick={() => fadeToggle(to, selectors, "flex")}>
                                        منصرف شدم
                                   </button>
                              </div>
                         </div>
                    </div>

               </section >
          </>
     )
})

export default TimePicker;
