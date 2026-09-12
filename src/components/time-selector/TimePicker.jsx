import { memo, useEffect, useRef, useState } from "react"
import styles from "./time.module.css"
import "../../main.css"
import { notifySuccess, notifyError } from "../../utils/Tostify";
// import { useSettings, SettingsContextTypes } from "../../contexts/Settings";
import {
       HiOutlineCheckCircle,
       HiOutlineClock,
} from "react-icons/hi2";
import {
       FiPlayCircle,
       FiStopCircle,
       FiSave,
       FiX,
} from "react-icons/fi";

const TimePicker = memo(({ callback, defaultStart, defaultEnd, mood = 0 /* 0=default | 1=success | 2=warning | 3=danger | 4=info */ }) => {

       let colorsSet;
       const colorsSetHandler = state => {
              switch (state) {
                     case 1: {
                            colorsSet = "#74e89a";
                            break;
                     }
                     case 2: {
                            colorsSet = "#de6f00";
                            break;
                     }
                     case 3: {
                            colorsSet = "#f50609";
                            break;
                     }
                     case 4: {
                            colorsSet = "#007ab3";
                            break;
                     }
                     default: {
                            colorsSet = "#ffebcd";
                            break;
                     }
              }
              return colorsSet;
       }

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

       // Stores the original inline scroll styles while the wheel picker is active.
       // This lets us lock BOTH the modal's scroll container and the page, then
       // restore their exact previous state after the gesture finishes.
       const lockedScrollParents = useRef([]);


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

       // UI-only scroll behavior:
       // 1) blocks wheel/touch propagation to the modal/page
       // 2) keeps the original selection logic intact
       function scrollHandler(event, element) {
              event?.preventDefault?.();
              event?.stopPropagation?.();

              if (!element) return;

              let items = Array.from(element.children);
              let selectedIndex = items.findIndex(li => li.classList.contains("selected"));

              if (selectedIndex === -1 && items.length) {
                     selectedIndex = 0;
                     selectItem(element, items[0]);
              }

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

       const lockOuterScrolling = () => {
              if (typeof window === "undefined" || lockedScrollParents.current.length) return;

              const nodes = [];
              let current = removeScrolling.current?.parentElement;

              // Find every actually-scrollable ancestor of the picker (usually the modal body).
              while (current && current !== document.documentElement) {
                     const computed = window.getComputedStyle(current);
                     const canScrollY =
                            current.scrollHeight > current.clientHeight &&
                            /(auto|scroll|overlay)/.test(computed.overflowY);

                     if (canScrollY) nodes.push(current);
                     current = current.parentElement;
              }

              // Also lock the document itself to prevent page scroll / rubber-banding.
              nodes.push(document.body, document.documentElement);

              const uniqueNodes = [...new Set(nodes.filter(Boolean))];

              lockedScrollParents.current = uniqueNodes.map(node => ({
                     node,
                     overflowY: node.style.overflowY,
                     overscrollBehaviorY: node.style.overscrollBehaviorY,
              }));

              lockedScrollParents.current.forEach(({ node }) => {
                     node.style.overflowY = "hidden";
                     node.style.overscrollBehaviorY = "none";
              });
       }

       const unlockOuterScrolling = () => {
              lockedScrollParents.current.forEach(({ node, overflowY, overscrollBehaviorY }) => {
                     node.style.overflowY = overflowY;
                     node.style.overscrollBehaviorY = overscrollBehaviorY;
              });

              lockedScrollParents.current = [];
       }

       // touching
       function addTouchSwipe(element) {
              let startY = 0;

              const touchStartHandler = (event) => {
                     startY = event.touches[0].clientY;
              };

              const touchMoveHandler = (event) => {
                     // Critical on mobile: stop the browser/modal from consuming this gesture.
                     if (event.cancelable) event.preventDefault();
                     event.stopPropagation();

                     let deltaY = event.touches[0].clientY - startY;

                     if (deltaY > 20) {
                            scrollHandler({ deltaY: -1 }, element);
                            startY = event.touches[0].clientY;
                     } else if (deltaY < -20) {
                            scrollHandler({ deltaY: 1 }, element);
                            startY = event.touches[0].clientY;
                     }
              };

              const touchEndHandler = () => { };

              element.addEventListener("touchstart", touchStartHandler, { passive: true });
              element.addEventListener("touchmove", touchMoveHandler, { passive: false });
              element.addEventListener("touchend", touchEndHandler, { passive: true });
              element.addEventListener("touchcancel", touchEndHandler, { passive: true });

              return () => {
                     element.removeEventListener("touchstart", touchStartHandler);
                     element.removeEventListener("touchmove", touchMoveHandler);
                     element.removeEventListener("touchend", touchEndHandler);
                     element.removeEventListener("touchcancel", touchEndHandler);
              };
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
              fadeToggle(from, selectors, "grid");
              fromSelector.current.textContent = `${fromMinAndHour.current.hour}:00`
       }
       const approvedToTime = () => {
              fadeToggle(to, selectors, "grid");
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

              // Keep the wheel's visual selection synchronized with the values displayed
              // in the selector cards. createTimeList itself is left unchanged.
              const startIndex = Number.parseInt(defaultStart, 10);
              const endIndex = Number.parseInt(defaultEnd, 10);

              if (
                     Number.isInteger(startIndex) &&
                     startIndex >= 0 &&
                     startIndex < fromHoursList.current.children.length
              ) {
                     selectItem(fromHoursList.current, fromHoursList.current.children[startIndex]);
              }

              if (
                     Number.isInteger(endIndex) &&
                     endIndex >= 0 &&
                     endIndex < toHoursList.current.children.length
              ) {
                     selectItem(toHoursList.current, toHoursList.current.children[endIndex]);
              }

              const removeFromTouch = addTouchSwipe(fromHoursList.current);
              // addTouchSwipe(fromMinuteList.current);
              const removeToTouch = addTouchSwipe(toHoursList.current);
              // addTouchSwipe(toMinuteList.current);

              // console.log(removeScrolling.current.parentElement.parentElement.parentElement.style.overflow = "hidden")

              return () => {
                     removeFromTouch?.();
                     removeToTouch?.();
                     unlockOuterScrolling();

                     // Prevent duplicate <li> nodes in React StrictMode remount cycles.
                     if (fromHoursList.current) fromHoursList.current.innerHTML = "";
                     if (toHoursList.current) toHoursList.current.innerHTML = "";
              };

       }, [])

       return (
              <>
                     <section
                            className="w-full select-none font-iranisans"
                            style={{ fontFamily: "cursive" }}
                            ref={removeScrolling}
                     >
                            <div className="w-full relative" ref={container}>
                                   {/* selectors */}
                                   <div
                                          className="relative grid w-full grid-cols-2 gap-[10px] pb-0 sm:gap-3"
                                          ref={selectors}
                                          dir="rtl"
                                   >
                                          <div
                                                 className="group w-full cursor-pointer overflow-hidden rounded-[14px] border border-neutral-100 dark:border-[#39414c] bg-white dark:bg-[#151b24] transition-[border-color,background-color,transform] duration-200 hover:border-[#74e89a]/60 hover:bg-[#18212a] active:scale-[0.985] focus-within:border-[#74e89a] sm:rounded-[16px]"
                                                 onClick={() => fadeToggle(selectors, from, "flex")}
                                          >
                                                 <div className="flex h-[38px] items-center gap-1.5 border-b border-neutral-100 dark:border-[#252d37] px-[11px] sm:h-[42px] sm:px-[13px]">
                                                        <FiPlayCircle
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0 sm:h-[19px] sm:w-[19px]"
                                                               aria-hidden="true"
                                                        />
                                                        <h6 className="inline !font-iranisans text-[12px] font-medium leading-none text-neutral-400 dark:text-[#c9d0d8] sm:text-[13px]">
                                                               شروع
                                                        </h6>
                                                 </div>

                                                 <p
                                                        ref={fromSelector}
                                                        dir="ltr"
                                                        className="flex h-[49px] items-center justify-center text-[21px] font-medium leading-none tracking-[0.01em] text-neutral-500 dark:text-[#f7f8fa] sm:h-[55px] sm:text-[23px]"
                                                 >
                                                        {defaultStart}
                                                 </p>
                                          </div>

                                          <div
                                                 className="group w-full cursor-pointer overflow-hidden rounded-[14px] border border-neutral-100 dark:border-[#39414c] bg-white dark:bg-[#151b24] transition-[border-color,background-color,transform] duration-200 hover:border-[#74e89a]/60 hover:bg-[#18212a] active:scale-[0.985] focus-within:border-[#74e89a] sm:rounded-[16px]"
                                                 onClick={() => fadeToggle(selectors, to, "flex")}
                                          >
                                                 <div className="flex h-[38px] items-center gap-1.5 border-b border-neutral-100 dark:border-[#252d37] px-[11px] sm:h-[42px] sm:px-[13px]">
                                                        <FiStopCircle
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0 sm:h-[19px] sm:w-[19px]"
                                                               aria-hidden="true"
                                                        />
                                                        <h6 className="inline !font-iranisans text-[12px] font-medium leading-none text-neutral-400 dark:text-[#c9d0d8] sm:text-[13px]">
                                                               پایان
                                                        </h6>
                                                 </div>

                                                 <p
                                                        ref={toSelector}
                                                        dir="ltr"
                                                        className="flex h-[49px] items-center justify-center text-[21px] font-medium leading-none tracking-[0.01em] text-neutral-500 dark:text-[#f7f8fa] sm:h-[55px] sm:text-[23px]"
                                                 >
                                                        {defaultEnd}
                                                 </p>
                                          </div>

                                          <button
                                                 style={{
                                                        background: colorsSetHandler(mood)
                                                 }}
                                                 type="button"
                                                 className="col-span-2 mt-[6px] flex h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] px-3 text-center font-iranisans text-[15px] font-bold text-[#0d1811] shadow-[0_10px_24px_rgba(116,232,154,0.18)] transition-all duration-200 hover:bg-[#82eda4] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#74e89a]/30 sm:h-[54px] sm:text-[16px]"
                                                 onClick={ok}
                                          >
                                                 <FiSave
                                                        style={{
                                                               color: colorsSetHandler(mood)
                                                        }}
                                                        className="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
                                                 ذخیره تغییرات
                                          </button>
                                   </div>

                                   {/* choose from */}
                                   <div
                                          className="relative w-full flex-col"
                                          style={{ display: "none" }}
                                          ref={from}
                                   >
                                          <div className="w-full overflow-hidden rounded-[14px] border border-neutral-100 dark:border-[#39414c] bg-white dark:bg-[#151b24] text-[#f7f8fa] sm:rounded-[16px]">
                                                 <h6 className="flex h-[40px] items-center gap-1.5 border-b border-neutral-100 dark:border-[#252d37] px-[12px] font-iranisans text-[12px] font-medium text-neutral-300 dark:text-[#c9d0d8] sm:h-[44px] sm:px-[14px] sm:text-[13px]">
                                                        <HiOutlineClock
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0  stroke-[1.8] sm:h-[19px] sm:w-[19px]"
                                                               aria-hidden="true"
                                                        />
                                                        ساعت
                                                 </h6>

                                                 <div
                                                        className="relative h-[148px] w-full touch-none overscroll-contain overflow-hidden px-[14px] py-[52px] sm:px-[16px]"
                                                        onMouseOver={() => {
                                                               lockOuterScrolling();
                                                        }}
                                                        onTouchStart={() => {
                                                               lockOuterScrolling();
                                                        }}
                                                        onMouseLeave={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                        onTouchEnd={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                        onTouchCancel={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                 >
                                                        {/* Fixed 44px selected rail. With li=44px and gap=20px,
                                                            every wheel step is EXACTLY 64px, matching selectItem(). */}
                                                        <div
                                                               className="pointer-events-none absolute left-[12px] right-[12px] top-1/2 z-0 h-[44px] -translate-y-1/2 rounded-[11px] border border-[#74e89a]/35 bg-[#74e89a]/[0.07] shadow-[inset_0_0_0_1px_rgba(116,232,154,0.02)] sm:left-[14px] sm:right-[14px]"
                                                               aria-hidden="true"
                                                        />
                                                        <div
                                                               className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[44px] bg-gradient-to-b from-[#e1e1e1] dark:from-[#151b24] via-[#e1dede]/90 dark:via-[#151b24]/90 to-transparent"
                                                               aria-hidden="true"
                                                        />
                                                        <div
                                                               className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[44px] bg-gradient-to-t from-[#e1e1e1] dark:from-[#151b24] via-[#e1dede]/90 dark:via-[#151b24]/90 to-transparent"
                                                               aria-hidden="true"
                                                        />

                                                        <ul
                                                               ref={fromHoursList}
                                                               onWheel={(event) => scrollHandler(event, fromHoursList.current)}
                                                               onKeyDown={(event) => scrollHandler(event, fromHoursList.current)}
                                                               tabIndex={0}
                                                               aria-label="انتخاب ساعت شروع"
                                                               className={` ${styles.scrollList} scrollList ${document.body.classList.contains("dark")
                                                                      ? "text-white-ul"
                                                                      : "text-black-ul"
                                                                      } relative z-10 !m-0 !w-full !list-none !p-0 touch-none overscroll-contain flex flex-col !gap-y-[20px] text-center [&_li]:!m-0 [&_li]:!flex [&_li]:!h-[44px] [&_li]:!min-h-[44px] [&_li]:!w-full [&_li]:!cursor-pointer [&_li]:!items-center [&_li]:!justify-center [&_li]:!p-0 [&_li]:!font-iranisans [&_li]:!text-[19px] [&_li]:!font-medium [&_li]:!leading-none   [&_li]:!opacity-65 [&_li]:transition-[color,opacity,transform] [&_li]:duration-150 [&_.selected]:!scale-[1.08] [&_.selected]:!font-bold   [&_.selected]:!opacity-100 focus:outline-none`}
                                                        ></ul>
                                                 </div>
                                          </div>

                                          <div className="mt-[10px] flex w-full gap-2 text-neutral-800" dir="rtl">
                                                 <button
                                                        type="button"
                                                        className="flex h-[46px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border border-[#74e89a] bg-[#74e89a] px-2 text-center font-iranisans text-[13px] font-bold text-[#0d1811] transition-all duration-200 hover:bg-[#82eda4] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#74e89a]/30 sm:h-[50px] sm:text-[14px]"
                                                        onClick={approvedFromTime}
                                                 >
                                                        <HiOutlineCheckCircle
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0 stroke-[1.9] sm:h-[18px] sm:w-[18px]"
                                                               aria-hidden="true"
                                                        />
                                                        تایید تایم شروع
                                                 </button>

                                                 <button
                                                        type="button"
                                                        className="flex h-[46px] w-[112px] text-[14px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[12px] border border-[#ef7676]/35 bg-[#ef7676]/10 px-2 text-center font-iranisans font-medium text-[#ff9b9b] transition-all duration-200 hover:bg-[#ef7676]/15 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#ef7676]/20 sm:h-[50px] sm:text-[13px]"
                                                        onClick={() => fadeToggle(from, selectors, "grid")}
                                                 >
                                                        <FiX
                                                               className="h-[16px] w-[16px] shrink-0 sm:h-[17px] sm:w-[17px] " aria-hidden="true" />
                                                        منصرف شدم
                                                 </button>
                                          </div>
                                   </div>

                                   {/* choose to */}
                                   <div
                                          className="relative w-full flex-col"
                                          style={{ display: "none" }}
                                          ref={to}
                                   >
                                          <div className="w-full overflow-hidden rounded-[14px] border border-neutral-100 dark:border-[#39414c] bg-white dark:bg-[#151b24] text-[#f7f8fa] sm:rounded-[16px]">
                                                 <h6 className="flex h-[40px] items-center gap-1.5 border-b border-neutral-100 dark:border-[#252d37] px-[12px] font-iranisans text-[12px] font-medium text-neutral-300 dark:text-[#c9d0d8] sm:h-[44px] sm:px-[14px] sm:text-[13px]">
                                                        <HiOutlineClock
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0 stroke-[1.8] sm:h-[19px] sm:w-[19px]"
                                                               aria-hidden="true"
                                                        />
                                                        ساعت
                                                 </h6>

                                                 <div
                                                        className="relative h-[148px] w-full touch-none overscroll-contain overflow-hidden px-[14px] py-[52px] sm:px-[16px]"
                                                        onMouseOver={() => {
                                                               lockOuterScrolling();
                                                        }}
                                                        onTouchStart={() => {
                                                               lockOuterScrolling();
                                                        }}
                                                        onMouseLeave={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                        onTouchEnd={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                        onTouchCancel={() => {
                                                               unlockOuterScrolling();
                                                        }}
                                                 >
                                                        <div
                                                               className="pointer-events-none absolute left-[12px] right-[12px] top-1/2 z-0 h-[44px] -translate-y-1/2 rounded-[11px] border border-[#74e89a]/35 bg-[#74e89a]/[0.07] shadow-[inset_0_0_0_1px_rgba(116,232,154,0.02)] sm:left-[14px] sm:right-[14px]"
                                                               aria-hidden="true"
                                                        />
                                                        <div
                                                               className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[44px] bg-gradient-to-b from-[#e1e1e1] dark:from-[#151b24] via-[#e1dede]/90 dark:via-[#151b24]/90 to-transparent"
                                                               aria-hidden="true"
                                                        />
                                                        <div
                                                               className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[44px] bg-gradient-to-t from-[#e1e1e1] dark:from-[#151b24] via-[#e1dede]/90 dark:via-[#151b24]/90 to-transparent"
                                                               aria-hidden="true"
                                                        />

                                                        <ul
                                                               ref={toHoursList}
                                                               onWheel={(event) => scrollHandler(event, toHoursList.current)}
                                                               onKeyDown={(event) => scrollHandler(event, toHoursList.current)}
                                                               tabIndex={0}
                                                               aria-label="انتخاب ساعت پایان"
                                                               className={` ${styles.scrollList} scrollList ${document.body.classList.contains("dark")
                                                                      ? "text-white-ul"
                                                                      : "text-black-ul"
                                                                      } relative z-10 !m-0 !w-full !list-none !p-0 touch-none overscroll-contain flex flex-col !gap-y-[20px] text-center [&_li]:!m-0 [&_li]:!flex [&_li]:!h-[44px] [&_li]:!min-h-[44px] [&_li]:!w-full [&_li]:!cursor-pointer [&_li]:!items-center [&_li]:!justify-center [&_li]:!p-0 [&_li]:!font-iranisans [&_li]:!text-[19px] [&_li]:!font-medium [&_li]:!leading-none [&_li]:!opacity-65 [&_li]:transition-[color,opacity,transform] [&_li]:duration-150 [&_.selected]:!scale-[1.08] [&_.selected]:!font-bold [&_.selected]:!opacity-100 focus:outline-none`}
                                                        ></ul>
                                                 </div>
                                          </div>

                                          <div className="mt-[10px] flex w-full gap-2 text-neutral-800" dir="rtl">
                                                 <button
                                                        type="button"
                                                        className="flex h-[46px] w-[112px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border border-[#74e89a] bg-[#74e89a] px-2 text-center font-iranisans text-[13px] font-bold text-[#0d1811] transition-all duration-200 hover:bg-[#82eda4] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#74e89a]/30 sm:h-[50px] sm:text-[14px]"
                                                        onClick={approvedToTime}
                                                 >
                                                        <HiOutlineCheckCircle
                                                               style={{
                                                                      color: colorsSetHandler(mood)
                                                               }}
                                                               className="h-[17px] w-[17px] shrink-0 stroke-[1.9] sm:h-[18px] sm:w-[18px]"
                                                               aria-hidden="true"
                                                        />
                                                        تایید تایم پایان
                                                 </button>

                                                 <button
                                                        type="button"
                                                        className="flex h-[46px] w-[112px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[12px] border border-[#ef7676]/35 bg-[#ef7676]/10 px-2 text-center font-iranisans text-[14px] font-medium text-[#ff9b9b] transition-all duration-200 hover:bg-[#ef7676]/15 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#ef7676]/20  "
                                                        onClick={() => fadeToggle(to, selectors, "grid")}
                                                 >
                                                        <FiX
                                                               className="h-[16px] w-[16px] shrink-0 sm:h-[17px] sm:w-[17px]" aria-hidden="true" />
                                                        منصرف شدم
                                                 </button>
                                          </div>
                                   </div>
                            </div>
                     </section>
              </>
       )
})

export default TimePicker;