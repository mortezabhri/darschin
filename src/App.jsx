import { Route, Routes } from "react-router-dom";
import Sidebar from "./layouts/sidebar";
import { SettingsProvider } from "./contexts/Settings";
import { ToastContainer } from "react-toastify";
import { Del, Get } from './utils/Storage'
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react";
import { PlanProvider } from "./contexts/Plans";
import NewVersion from "./components/NewVersion";
import { toast } from 'react-toastify'


// PAGES
import Home from "./pages/Home";
import TotalPlans from "./pages/TotalPlans";
import FAQ from "./pages/FAQ";
import Welcome from "./pages/Welcome";
import Settings from "./pages/Settings";

function App() {

       const navigate = useNavigate();
       const location = useLocation();

       useEffect(() => {
              // welcome page
              if (!Get("welcome")) {
                     navigate("/welcome");
              }
              // them config
              if (Get("them") === "dark") {
                     document.body.classList.remove("light")
                     document.body.classList.add("dark");
              } else if (Get("them") === "light") {
                     document.body.classList.remove("dark")
                     document.body.classList.add("light");
              }
              // check file for downlad in another page 
              // console.log(location)
       }, [])

       useEffect(() => {
              // if downloading pdf
              if (Get("download_pdf_handler")) {
                     if (location.pathname !== "/plans") {
                            const toastLoadID = Get("download_pdf_handler");
                            toast.update(toastLoadID, {
                                   isLoading: false,
                                   type: "error",
                                   autoClose: 3000,
                                   render: "در هنگام ایجاد فایل از صفحه خارج نشوید (ناموفق!)"
                            })
                            Del("download_pdf_handler");
                     }
              }
              // if downloading png
              if (Get("download_png_handler")) {
                     if (location.pathname !== "/plans") {
                            const toastLoadID = Get("download_png_handler");
                            toast.update(toastLoadID, {
                                   isLoading: false,
                                   type: "error",
                                   autoClose: 3000,
                                   render: "در هنگام ایجاد فایل از صفحه خارج نشوید (ناموفق!)"
                            })
                            Del("download_png_handler");
                     }
              }
       }, [location.pathname])


       return (
              <PlanProvider>
                     <SettingsProvider>
                            <section className="min-w-xs max-w-lg mx-auto select-none bg-quaternary dark:bg-neutral-500 transition-all min-h-screen relative overflow-x-hidden" id="main">
                                   <ToastContainer rtl style={{ zIndex: 9999999 }} />
                                   <Sidebar />
                                   <div className="py-6"></div>
                                   <Routes>
                                          <Route path="/" element={<Home />} />
                                          <Route path="/plans" element={<TotalPlans />} />
                                          <Route path="/faq" element={<FAQ />} />
                                          <Route path="/welcome" element={<Welcome />} />
                                          <Route path="/settings" element={<Settings />} />
                                          <Route path="/*" element={<Home />} />
                                   </Routes>
                            </section>
                     </SettingsProvider>
              </PlanProvider>
       )
}

export default App;
