import { getTodayNumber } from "../utils/getDateToday"
import { showNotif } from "../utils/Notification"
import { Get } from "../utils/Storage"

export function useNotification() {
       if (!Get("plans")) return ;

       const todayPlans = Get("plans").filter(i => i.day === getTodayNumber())
       const startTimes = todayPlans.map(i => ({ lesson: i.lesson, start: i.start }))
       // console.log(startTimes)

       const checkTime = () => { 
              const now = new Date();
              const hours = now.getHours();
              const minutes = now.getMinutes();



              startTimes.forEach(item => {
                     // console.log("now ->" , hours , " time to notif -> " , item.start , " lesson -> " , item.lesson)
                     // console.log("hours start time (in condition) -> " , (Number(item.start) - 1) , "minutes in real -> " , minutes)
                     if (hours === (Number(item.start) - 1) && minutes === 55) {
                            // SHOW NOTIFICATION... 
                            showNotif("اعلان کلاس جدید", `کلاس ${item.lesson} تا چند دقیقه دیگه شروع میشه. حواست هست؟`);
                     }
              });

       };

       const interval = setInterval(checkTime, 30000); 
       // const interval = setInterval(checkTime, 5000); 
       return null
} 