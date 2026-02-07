import React, { useEffect, useRef, useState } from 'react'

export default function AskAnswer({ ask, answer }) {

       const [open, setOpen] = useState(false);
       const height = useRef(0);
       const h1 = useRef(null);
       const [h1Height, setH1Height] = useState(62);

       useEffect(() => {
              setH1Height(h1.current.clientHeight)
       }, [h1])

       return (
              <>
                     <div className='w-full relative transition-all duration-300 mb-4' dir='rtl'
                            style={{
                                   height: h1.current ? open ? height.current.clientHeight + h1.current.clientHeight + 20 : h1.current.clientHeight : 0
                            }}
                     >
                            <h1
                                   onClick={() => setOpen(prev => !prev)}
                                   ref={h1}
                                   className='w-full cursor-pointer py-4 bg-neutral-300 px-4 font-iranisans font-semibold border border-b-0 border-neutral-400 rounded-xl absolute z-2'>{ask}</h1>
                            <div
                                   style={{
                                          height: (open && height) ? height.current.clientHeight + h1.current.clientHeight + 20 : h1.current ? h1.current.clientHeight + 2 : 0
                                   }}
                                   className='absolute top-0 left-0 w-full border z-1 h-36 border-neutral-400 rounded-xl px-4 transition-all duration-300 overflow-hidden font-iranisans'
                            >
                                   <p ref={height} style={{
                                          opacity: open ? 1 : 0,
                                          transform: (h1.current && h1.current.clientHeight > 60) && "translateY(5.5rem)"
                                   }} className={`transition-all duration-300 dark:text-white opacity-0 ${(h1.current && h1.current.clientHeight > 60) ? "translate-y-0" : "translate-y-[4rem]"}`}>{answer}</p>
                            </div>
                     </div>
              </>
       )
}
