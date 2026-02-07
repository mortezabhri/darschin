import { Accordion } from "../components/Accordion"
import { AccordionItem } from "./../components/AccordionItem"


export default function FAQ() {

       const arrayOfFaq = [
              {
                     ask: "چطور درسی رو به برنامم اضافه کنم؟",
                     answer: "کافیه از منوی کناری گزینه درس جدید رو انتخاب کنید و نام درس ، توضیحات ، روز هفته و ساعت شروع و پایان کلاس رو انتخاب کرده و تایید کنید.توجه داشته باشید که اگر تایمی رو ثبت کنید که با تایم قبلی تون تداخل داشته باشه درس جدید حذف میشه و اطلاعاتش در دسترس نیست"
              },
              {
                     ask: "میتونم لیست تمام درس هارو در قالب PDF داشته باشم؟",
                     answer: "این آپشن در ورژن جدید فعال شده و کافیه به صفحه تنظیمات رفته و روی دریافت فایل پی دی اف کلیک کنید"
              },
              {
                     ask: "به یک باگ/اروری خوردم. چطور به ادمین خبر بدم؟",
                     answer: "میتونید به آیدی @mbhdev در تلگرام پیام بدید "
              },
              {
                     ask: "چرا زمانی که میخوام تایم انتخاب کنم صفحه اسکرول میشه؟",
                     answer: "این مشکل به این دلیل پیش میاد که مرورگر متوجه نمیشه که اسکرول شما روی باکس انتخاب هست ، برای رفع این مشکل کافیه یکبار روی اعداد کلیک کنید تا مرورگر روی باکس فوکوس کنه."
              },
              {
                     ask: "چطور میتونم تمام درس هایی که به برنامم اضافه شده رو ببینم؟",
                     answer: "از طریق منوی کنار صفحه و گزینه نمایش تمام درس ها ، تمام درس هایی که به برنامه خودتون اضافه کردید رو میتونید ببینید"
              },
              {
                     ask: "تایم مدرسه / دانشگاه من از 8 الی 17 بیشتره/ کمتره. چطور میتونم تنظیممش کنم؟",
                     answer: "از بخش تنظیم تایم روز در منوی کناری میتونید تایم روز هایی که در دانشگاه / مدرسه هستید رو تنظیم کنید. "
              },
              // {
              //        ask: "آیا درس چین نسخه دسکتاپ نداره ؟",
              //        answer: "با تحقیقاتی که روی کاربران احتمالی سایت انجام شد ، متوجه شدیم که 85 تا 95 درصد کاربران درس چین از موبایل استفاده میکنند. بر این شد که تصمیم گرفتیم فاز اول و آزمایشی درس چین رو موبایل فرست ران کنیم. درصورت حمایت شما نسخه های بعدی بصورت کاملا ریسپانسیو خواهد بود"
              // },
              {
                     ask: "چطور میتونم حمایت کنم؟",
                     answer: "کافیه به ریپو این پروژه در گیتهاب (لینک در پایان صفحه)استار بدید."
              }
       ]

       return (
              <>
                     <section className='w-full px-4 '>
                            <div className="absolute top-1 right-0 w-full h-52 flex justify-center items-center">
                                   <img src="./images/title_shape/title_shape_blue.png" className="w-full h-full" alt="" />
                                   <p className="absolute text-2xl font-morabba-bold">سوالات متداول</p>
                            </div>
                            <div className='mt-40 mb-16' dir='rtl'>
                                   <Accordion>
                                          {
                                                 arrayOfFaq.map(item => (
                                                        <AccordionItem key={Math.random() * 1000} eventKey={Math.random() * 1000} className={"bg-neutral-300 rounded-xl font-morabba"} classNameBody={"font-morabba border border-neutral-300 rounded-b-xl -mt-2"}>
                                                               {/* btn */}
                                                               <h1 className=' cursor-pointer py-4 bg-neutral-300 px-4 border-neutral-400 rounded-xl font-semibold' >
                                                                      {item.ask}
                                                               </h1>
                                                               {/* content */}
                                                               <p className={`transition-all duration-300 text-black dark:text-white`}>
                                                                      {item.answer}
                                                               </p>
                                                        </AccordionItem>
                                                 ))
                                          }
                                   </Accordion>
                            </div>
                     </section>
                     <div className="absolute -bottom-0 w-full px-4" dir='rtl'>
                            <p className='text-sm font-iranisans text-left dark:text-white' >
                                   <a href="https://github.com/mortezabhri/darschin-react" className='text-black dark:text-white underline inline-block mx-2'>(لینک گیتهاب پروژه)</a>
                            </p>
                     </div>
              </>
       )
}
