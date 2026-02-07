import React from 'react'
import { useState } from 'react'
import Modal from '../components/Modal'
import { useNavigate } from "react-router-dom"
import { Add, Get } from '../utils/Storage';
import { useEffect } from 'react';

export default function Welcome() {

       const [open, setOpen] = useState(false);
       const navigate = useNavigate();

       useEffect(() => {
              if (Get("welcome")) {
                     navigate("/");
                     return;
              }
       }, [])

       return (
              <>
                     <section className='w-full h-screen overflow-hidden z-9999 absolute top-0 left-0 bg-quaternary'>
                            {/* circles */}
                            <div className='size-62 bg-primary rounded-full absolute top-[12rem] left-[25rem] opacity-50 animate-bg-primary'></div>
                            <div className='size-62 bg-tertiary rounded-full absolute top-[-10rem] left-[-10%] opacity-50 animate-bg-tertiary'></div>
                            <div className='size-48 bg-indigo-300 rounded-[5.3rem] absolute bottom-[-4rem] left-0 opacity-50 animate-bg-indigo'></div>
                            <div className='w-full pt-[10vh] flex justify-center items-center' dir='rtl'>
                                   <div className='flex flex-col justify-center items-center gap-y-6'>
                                          <h4 className='font-ghaf text-5xl'>به</h4>
                                          <h4 className='font-ghaf text-8xl'>درس چین</h4>
                                          <h4 className='font-ghaf text-5xl'>خوش اومدی</h4>
                                          <p className='font-iranisans font-semibold mt-12 text-xl'>با چند کلیک ، یک برنامه تمیز بساز</p>
                                          <button className='px-8 border border-neutral-300 text-lg shadow-xl font-iranisans py-1 rounded-lg bg-quaternary transition-all hover:-rotate-3 cursor-pointer hover:scale-110' onClick={() => setOpen(prev => !prev)}>برو بریم</button>
                                          <Modal isOpen={open} closeBtn={false}>
                                                 <p dir='rtl' className='text-center text-2xl text-red-400 font-iranisans'>کار با درس چین مثل آب خوردنه ولی یادت نره برای اولین بار حتما به بخش سوالات متداول سر بزنی که یک دید جزیی تری از درس چین پیدا کنی .</p>
                                                 <div className='w-full flex justify-center pb-4 pt-6'>
                                                        <button
                                                               onClick={() => {
                                                                      Add("welcome", true);
                                                                      navigate("/");
                                                               }}
                                                               className='px-8 border border-neutral-300 text-lg shadow-xl font-iranisans py-1 rounded-lg bg-secondary text-white transition-all cursor-pointer animate-btnShoingModalFirst opacity-0'>اوکیه</button>
                                                 </div>
                                          </Modal>
                                   </div>
                            </div>
                     </section>
              </>
       )
}
