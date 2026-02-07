import { memo, useState , useRef, useEffect} from "react"
import Modal from "./Modal";
import { Get, Add } from "../utils/Storage";
import { notifyError, notifySuccess } from "../utils/Tostify";

export default memo(({ title, description, badgeID, lessonID }) => {

     const [open, setOpen] = useState(false);
     const [clicked, setClicked] = useState(false);
     const spanElem = useRef(null);

     const deleteBadge = (lesson, id) => {
          if (!clicked) { setClicked(true); return; };

          const allPlansWithoutThisID = Get("plans").filter(item => item.id !== lesson);
          const plan = Get("plans").filter(item => item.id === lesson)[0];
          // const withBadge = plan.badges.filter(item => item.id === id)[0];
          const withoutBadge = plan.badges.filter(item => item.id !== id);

          allPlansWithoutThisID.push({
               ...plan,
               badges: withoutBadge
          })

          Add("plans", allPlansWithoutThisID);
          notifySuccess("برچسب حذف شد");
          setClicked(false)
          setOpen(false)
          spanElem.current.remove()
     }

     useEffect(() => {
          if (open === false) setClicked(false) 
     } , [open])

     return (
          <>
               <Modal onClose={() => setOpen(prev => !prev)} isOpen={open} >
                    <h1 className="pt-4 pb-4 w-full text-xl text-center font-iranisans border-b" dir="rtl">{title}</h1>
                    <p className="pt-6 text-center w-full font-iranisans" dir="rtl">{description ?? "\"بدون توضیحات\""}</p>
                    <div className={`absolute top-3 left-3 bg-gray-600 rounded-xl p-0.5 flex transition-all cursor-pointer h-9 ${!clicked ? "min-w-9 max-w-9" : "min-w-56 max-w-56"} overflow-hidden`} onClick={() => deleteBadge(lessonID, badgeID)}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="min-w-8 max-w-8 min-h-8 max-h-8" viewBox="0 0 24 24" fill="none">
                              <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#ff0000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                         <div className="flex justify-center items-center text-sm font-iranisans min-w-44 max-w-44">
                              <p>جهت حذف، مجدد کلیک کنید</p>
                         </div>
                    </div>
               </Modal>
               <span
                    ref={spanElem}
                    onClick={() => setOpen(prev => !prev)}
                    className="w-[90%] px-0.5 py-0.5 bg-amber-600 rounded-full text-xs text-center"
               >
                    {title}
               </span>
          </>
     )
}
) 