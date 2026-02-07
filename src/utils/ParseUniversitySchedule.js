import Counter from "./Counter";


export default function ParseUniversitySchedule(input, error = () => { }) {

     if (!input || (!input.includes("\n") && !input.includes("\t"))) {
          error("INVALID_DATA")
          return false;
     }

     const sepratingLessons = {};
     const dataSeprateByEnter = input.split("\n");
     const lessons = {};
     let eachLesson;
     let hours;
     let counter = 0;
     try {
          // Separating each lesson from dataSeprateByEnter into a three-cell array
          for (let key in dataSeprateByEnter) {
               if (key !== 0 && key % 3 === 0) counter++;
               if (lessons[counter] && typeof lessons[counter] === "object") {
                    lessons[counter].push(dataSeprateByEnter[key])
               } else {
                    lessons[counter] = [];
                    lessons[counter].push(dataSeprateByEnter[key])
               }
          }
          // Reformating lessons
          for (let key in lessons) {
               eachLesson = lessons[key];
               // Set between hours
               hours = Counter(
                    eachLesson[1].split("-").at(1).trim().split(" ")[0].split("تا")[0].substr(-5).split(":")[0]
                    ,
                    eachLesson[1].split("-").at(1).trim().split(" ")[0].split("تا")[1].split(":")[0]
               ).length
               // Parsing data
               sepratingLessons[key] = {
                    lesson: eachLesson[0].split("\t")[0].trim(), // lesson name
                    start: eachLesson[1].split("-").at(1).trim().split(" ")[0].split("تا")[0].substr(-5).split(":")[0].trim(), // lesson start time 
                    end: eachLesson[1].split("-").at(1).trim().split(" ")[0].split("تا")[1].split(":")[0].trim(), // lesson end time 
                    master: eachLesson[1].split("-").at(-2).trim(),  // استاد درس 
                    description: getBracketContent(eachLesson[1]) ?? "-", // اطلاعات کلاس 
                    all_units: `${Number(eachLesson[0].split("\t")[2].trim()) /*تعداد واحدتئوری */}-${Number(eachLesson[0].split("\t")[3].trim())/*تعداد واحد عملی */}-${Number(eachLesson[0].split("\t")[4].trim()) /* تعداد کل واحد ها */}`,
                    exam_day: checkExamDay(eachLesson[2].split("-")[0].split("ساعت")[0].trim().substr(6)) ?? "-", // تاریخ امتحان 
                    exam_time: checkExamTime(eachLesson[2].split("-")[0].split("ساعت")[1].trim()) ?? "-",  // زمان امتحان 
                    day: checkDay(eachLesson[1].split("-")[1].split("[")[0].split("تا")[0].split(":")[0].slice(0, -2).trim()),
                    hours: hours,
                    id: Math.floor(Math.random() * 1000 * Math.random() * 1000)
               }
          }
     } catch (err) {
          error("INCORRECT_FORMAT");
          return false;
     }
     return sepratingLessons;
}

function getBracketContent(str) {
     const match = str.match(/\[(.*?)\]/);
     return match ? match[1].trim() : null;
}
function checkExamDay(str) {
     if (str.includes("مدرس")) {
          return null;
     } else {
          return str
     }
}
function checkExamTime(str) {
     if (str) {
          return str;
     } else {
          return null
     }
}
function checkDay(str) {
     switch (str) {
          case "شنبه": return 0;
          case "یک‌شنبه": return 1;
          case "دوشنبه": return 2;
          case "سه‌شنبه": return 3;
          case "چهارشنبه": return 4;
          case "پنجشنبه": return 5;
          case "جمعه": return 6;
          default: return null;
     }
}

