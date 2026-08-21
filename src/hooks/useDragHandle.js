import { useEffect, useRef } from "react";

export default function useDragHandle(setOpen) {
       const startY = useRef(0);
       const currentY = useRef(0);
       const isDragging = useRef(false);

       const CLOSE_THRESHOLD = 100;

       useEffect(() => {
              const modal = document.getElementById("modalContainer");
              const handle = document.getElementById("dragHandle");

              if (!modal || !handle) return;

              const onPointerDown = (e) => {
                     if (e.pointerType !== "touch") return;

                     isDragging.current = true;

                     startY.current = e.clientY;
                     currentY.current = 0;

                     modal.style.transition = "none";

                     handle.setPointerCapture(e.pointerId);
              };


              const onPointerMove = (e) => {
                     if (!isDragging.current) return;

                     const deltaY = e.clientY - startY.current;

                     // فقط اجازه حرکت به پایین
                     currentY.current = Math.max(deltaY, 0);

                     modal.style.transform = `translateY(${currentY.current}px)`;
              };


              const onPointerUp = () => {
                     if (!isDragging.current) return;

                     isDragging.current = false;

                     modal.style.transition = "all 300ms";


                     // اگر بیشتر از حد تعیین شده کشیده شد
                     if (currentY.current > CLOSE_THRESHOLD) {
                            modal.style.transform = "translateY(100%)";

                            // setTimeout(() => {
                                   modal.style.transform = "";
                                   setOpen(prev => !prev);
                            // }, 100);

                            return;
                     }


                     // برگشت به حالت اولیه
                     modal.style.transform = "";
              };


              handle.addEventListener("pointerdown", onPointerDown);
              handle.addEventListener("pointermove", onPointerMove);
              handle.addEventListener("pointerup", onPointerUp);
              handle.addEventListener("pointercancel", onPointerUp);


              return () => {
                     handle.removeEventListener("pointerdown", onPointerDown);
                     handle.removeEventListener("pointermove", onPointerMove);
                     handle.removeEventListener("pointerup", onPointerUp);
                     handle.removeEventListener("pointercancel", onPointerUp);
              };

       }, [setOpen]);
}