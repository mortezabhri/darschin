 

export default function HamberMenu({open , onClose , className}) {

     return (
          <div className={`${className} stroke-neutral-600 dark:stroke-neutral-300 size-7 select-none`}>

               <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer" onClick={onClose} xmlns="http://www.w3.org/2000/svg">
                    <line
                         style={{
                              transform : open ? "rotate(45deg) translate(-8px, -12px)" : "rotate(0deg)"
                         }}
                         className='transition-all'
                         x1="20"
                         y1="10"
                         x2="90"
                         y2= "10"
                          strokeWidth="12" strokeLinecap="round" />
                    <line
                         style={{
                              transform: open ? "rotate(-45deg) translate(-54px, 12px)" : "rotate(0deg)"
                         }}
                         className='transition-all'
                         x1="20"
                         y1="35"
                         x2="90"
                         y2="35"
                         strokeWidth="12" strokeLinecap="round" />
                    <line
                         style={{
                              transform : open ? "rotate(45deg) translate(-8px, -62px)" : "rotate(0deg)"
                         }}
                         className='transition-all' x1="20" y1="60" x2="90" y2="60" strokeWidth="12" strokeLinecap="round" />
               </svg>

          </div>
     )
}
