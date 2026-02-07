import { useEffect, useRef, useState } from 'react'
import Table from '../components/Table'
import { Del, Get } from '../utils/Storage'
import { toast } from 'react-toastify'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { notifyError, notifyWarn } from '../utils/Tostify';

export default function TotalPlans() {
       let NumberOfDaysOfTheWeek = [];

       if (!Get("vocation"))
              NumberOfDaysOfTheWeek = [
                     0,
                     1,
                     2,
                     3,
                     4
              ]
       else
              NumberOfDaysOfTheWeek = [
                     0,
                     1,
                     2,
                     3,
                     4,
                     5,
                     6
              ]

       // download pdf
       const downloadPdf = async () => {
              try {
                     const element = pdfRef.current;

                     // get snapshot from DOM
                     const canvas = await html2canvas(element, { scale: 1 });
                     const imgData = canvas.toDataURL("image/png");

                     // pdf create
                     const pdf = new jsPDF("p", "px", "a1");
                     const pageWidth = pdf.internal.pageSize.getWidth();
                     const pageHeight = pdf.internal.pageSize.getHeight();

                     const imgWidth = pageWidth;
                     const imgHeight = (canvas.height * imgWidth) / canvas.width;

                     // add page , if larger
                     let heightLeft = imgHeight;
                     let position = 0;

                     pdf.addImage(imgData, "JPG", 0, position, imgWidth, imgHeight);
                     heightLeft -= pageHeight;

                     while (heightLeft > 0) {
                            position = heightLeft - imgHeight;
                            pdf.addPage();
                            pdf.addImage(imgData, "JPG", 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                     }

                     // download
                     pdf.save("dars-chin.pdf");

                     // show toast and delete localstorage data (download_pdf_handler)
                     const toastLoadID = Get("download_pdf_handler");
                     toast.update(toastLoadID, {
                            isLoading: false,
                            type: "success",
                            autoClose: 3000,
                            render: "فایل پی دی اف با موفقیت ذخیره شد 👌 "
                     })
                     Del("download_pdf_handler");

                     // update dom after download pdf
                     setUpdateAfterPdf(prev => prev + 1);
              } catch (error) {
                     const toastLoadID = Get("download_pdf_handler");
                     toast.update(toastLoadID, {
                            isLoading: false,
                            type: "error",
                            autoClose: 3000,
                            render: "مشکل در ایجاد فایل لطفا مجددا امتحان  کنید!"
                     })
                     Del("download_pdf_handler");
                     // update dom after download pdf
                     setUpdateAfterPdf(prev => prev + 1);
              }
       };

       // download image 
       const downloadImage = async (ref) => {

              try {

                     if (!ref.current) return;

                     const canvas = await html2canvas(ref.current, {
                            scale: 2, // quality
                            useCORS: true,
                     });

                     const imageData = canvas.toDataURL("image/png");

                     const link = document.createElement("a");
                     link.href = imageData;
                     link.download = "dars-chin.png";

                     // console.log(link)

                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);

                     // show toast and delete localstorage data (download_png_handler)
                     const toastLoadID = Get("download_png_handler");
                     toast.update(toastLoadID, {
                            isLoading: false,
                            type: "success",
                            autoClose: 3000,
                            render: "عکس با موفقیت ذخیره شد 👌 "
                     })
                     Del("download_png_handler");

                     // update dom after download png
                     setUpdateAfterPdf(prev => prev + 1);

              } catch (error) {
                     const toastLoadID = Get("download_png_handler");
                     toast.update(toastLoadID, {
                            isLoading: false,
                            type: "error",
                            autoClose: 3000,
                            render: "مشکل در ایجاد فایل لطفا مجددا امتحان  کنید!"
                     })
                     Del("download_png_handler");
                     // update dom after download png
                     setUpdateAfterPdf(prev => prev + 1);
              }

       };


       const [updateAfterPdf, setUpdateAfterPdf] = useState(0)
       const pdfRef = useRef(null);

       useEffect(() => {

              if (Get("download_pdf_handler")) {
                     notifyError("برچسب ها در پی دی اف نمایش داده نمیشوند");
                     setTimeout(() => downloadPdf(), 1500)
              }
              if (Get("download_png_handler")) {
                     notifyError("برچسب ها در عکس نمایش داده نمیشوند");
                     setTimeout(() => downloadImage(pdfRef), 1500)
              }

       }, [])

       return (
              <section className='w-full px-4'>
                     {/* svg box */}
                     <div className="absolute top-1 right-0 w-full h-52 flex justify-center items-center">
                            <img src="./images/title_shape/title_shape_green.png" className="w-full h-full" alt="" />
                            <p className="absolute text-2xl font-morabba-bold">لیست تمام درس ها</p>
                     </div>
                     <div className={`${(Get("download_pdf_handler") || Get("download_png_handler")) && "px-6 pt-2 bg-quaternary dark:bg-neutral-500"} mt-42 flex flex-col gap-y-8 pb-8`} ref={pdfRef}>
                            {
                                   NumberOfDaysOfTheWeek.map(item => {
                                          return <Table day={item} key={item} />
                                   })
                            }
                     </div>
              </section>
       )
}
