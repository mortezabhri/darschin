export default function (arr) {
     let randomNum;

     // استخراج همه id های موجود در آرایه
     const existingIds = arr ? arr.map(item => item.id) : [];

     do {
          randomNum = Math.floor(Math.random() * 10000);
     } while (existingIds.includes(randomNum));

     return randomNum;
}
