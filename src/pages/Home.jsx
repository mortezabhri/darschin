import GetDataToday from "../utils/getDateToday";
import Table from "../components/Table";
import { useEffect, useRef } from "react";



export default function Home() {

       const sliderDay = useRef("");
       const slideTables = {
              next: 0,
              center: 0,
              last: 0
       };
       useEffect(() => {
              slideTables.center = sliderDay.current.clientWidth / 3;
              slideTables.next = slideTables.center * 2;
              sliderDay.current.style.translate = `-${slideTables.center}px`;
              setTimeout(() => {
                     sliderDay.current.style.transitionTimingFunction = "linear(0 0%, 0 1.8%, 0.01 3.6%, 0.03 6.35%, 0.07 9.1%, 0.13 11.4%, 0.19 13.4%, 0.27 15%, 0.34 16.1%, 0.54 18.35%, 0.66 20.6%, 0.72 22.4%, 0.77 24.6%, 0.81 27.3%, 0.85 30.4%, 0.88 35.1%, 0.92 40.6%, 0.94 47.2%, 0.96 55%, 0.98 64%, 0.99 74.4%, 1 86.4%, 1 100%)";
                     sliderDay.current.style.transitionDuration = "400ms";
              }, 500)
       }, [])

       return (
              <>
                     <section>
                            {/* circle on top */}
                            <div className="size-36 scale-400 bg-tertiary dark:bg-secondary rounded-full absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg"></div>
                            {/* header */}
                            <header className="w-full h-56 relative -top-2 flex justify-around items-center text-neutral-900 dark:text-neutral-200" dir="rtl">
                                   {/* titles */}
                                   <div>
                                          <h1 className="text-5xl font-morabba-bold">{GetDataToday("weekday")}</h1>
                                          <h4 className="text-2xl mt-4 font-iranisans text-center" dir="rtl">{GetDataToday()}</h4>
                                   </div>
                                   {/* icon */}
                                   <div className="relative -translate-y-4">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="size-34" viewBox="0 0 24 24" fill="none">
                                                 <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10V11H3V10Z" className="stroke-neutral-900 dark:stroke-neutral-200" strokeOpacity="0.24" strokeWidth="1.2" />
                                                 <rect x="3" y="6" width="18" height="15" rx="2" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" />
                                                 <path d="M7 3L7 8" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" strokeLinecap="round" />
                                                 <path d="M17 3L17 8" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" strokeLinecap="round" />
                                          </svg>
                                          <p className="absolute top-19 left-0 w-full text-center font-morabba-bold text-2xl">{GetDataToday("day")} / {GetDataToday("monthNumeric")}</p>
                                   </div>
                                   {/* next day */}
                                   <div onClick={() => sliderDay.current.style.translate = `-${slideTables.next}px`} className="w-20 h-10 cursor-pointer rounded-md border dark:border-secondary border-tertiary absolute -bottom-14 right-3 flex items-center">
                                          {/* icon */}
                                          <div className="flex justify-center items-center h-full">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="size-9" viewBox="0 0 24 24" fill="none" >
                                                        <path className="dark:fill-secondary fill-tertiary" d="M15.1997 10.4919L13.2297 8.52188L10.0197 5.31188C9.33969 4.64188 8.17969 5.12188 8.17969 6.08188V12.3119V17.9219C8.17969 18.8819 9.33969 19.3619 10.0197 18.6819L15.1997 13.5019C16.0297 12.6819 16.0297 11.3219 15.1997 10.4919Z" fill="" />
                                                 </svg>
                                          </div>
                                          {/* text */}
                                          <div className="flex justify-center items-center h-full">
                                                 <p className="font-iranisans text-sm">دیروز</p>
                                          </div>
                                   </div>
                                   {/* today */}
                                   <div onClick={() => sliderDay.current.style.translate = `-${slideTables.center}px`} className="w-12 pt-4 cursor-pointer rounded-md  absolute -bottom-14 left-1/2 -translate-x-1/2 ">
                                          {/* text */}
                                          <div className="flex justify-center items-center relative">
                                                 <p className="font-iranisans text-sm absolute -top-3">امروز</p>
                                          </div>
                                          {/* icon */}
                                          <div className="flex justify-center items-center ">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="size-12" viewBox="0 0 24 24" >
                                                        <path className="fill-neutral-300" d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z" />
                                                 </svg>
                                          </div>
                                   </div>
                                   {/* last day */}
                                   <div
                                          onClick={() => sliderDay.current.style.translate = `-${slideTables.last}px`}
                                          className={`w-20 h-10 cursor-pointer rounded-md border dark:border-secondary border-tertiary absolute -bottom-14 left-3 flex items-center`}
                                          dir="ltr"
                                   >
                                          {/* icon */}
                                          <div className="flex justify-center items-center h-full">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="size-9" viewBox="0 0 24 24" fill="none"  >
                                                        <path className="dark:fill-secondary fill-tertiary" d="M13.9783 5.31877L10.7683 8.52877L8.79828 10.4888C7.96828 11.3188 7.96828 12.6688 8.79828 13.4988L13.9783 18.6788C14.6583 19.3588 15.8183 18.8688 15.8183 17.9188V12.3088V6.07877C15.8183 5.11877 14.6583 4.63877 13.9783 5.31877Z" fill="" />
                                                 </svg>
                                          </div>
                                          {/* text */}
                                          <div className="flex justify-center items-center h-full">
                                                 <p className="font-iranisans text-sm">فردا</p>
                                          </div>

                                   </div>
                            </header>
                            {/* main */}
                            <main className="w-full relative font-iranisans mt-16 mb-8">

                                   <div
                                          className="w-[calc(100%*3)] flex"
                                          ref={sliderDay}
                                   >

                                          {/* tomarro */}
                                          <div className="w-full px-8">
                                                 <Table day={(new Date().getDay() + 2) % 7} />
                                          </div>
                                          {/* today */}
                                          <div className="w-full px-8">
                                                 <Table day={(new Date().getDay() + 1) % 7} />
                                          </div>
                                          {/* yesterday */}
                                          <div className="w-full px-8">
                                                 <Table day={(new Date().getDay()) % 7} />
                                          </div>

                                   </div>

                            </main>
                     </section>
              </>
       )
}
