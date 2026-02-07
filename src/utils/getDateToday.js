
export default function GetDateToday(date = null) {
       const allDateToday = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
       const getDay = new Date().toLocaleDateString('fa-IR', { day: 'numeric' });
       const getWeekday = new Date().toLocaleDateString('fa-IR', { weekday: 'long' });
       const getMonth = new Date().toLocaleDateString('fa-IR', { month: 'long' });
       const getNumeric = new Date().toLocaleDateString('fa-IR', { month: 'numeric' });
       const getYear = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });

       switch (date) {
              case "year": return getYear;
              case "month": return getMonth;
              case "monthNumeric": return getNumeric;
              case "day": return getDay;
              case "weekday": return getWeekday;
              default: return allDateToday;
       }
}

export function formatDatePlusDaysFrom(dateInput, days = 0) {
       const d = new Date(dateInput); // می‌تواند رشته یا Date باشد
       d.setDate(d.getDate() + days);
       const dd = String(d.getDate()).padStart(2, '0');
       const mm = String(d.getMonth() + 1).padStart(2, '0');
       const yyyy = d.getFullYear();
       return `${yyyy}/${mm}/${dd}`;
}

// export function formatDatePlusDaysFromReverse(dateInput, days = 0) {
//        const d = new Date(dateInput); // می‌تواند رشته یا Date باشد
//        d.setDate(d.getDate() + days);
//        const dd = String(d.getDate()).padStart(2, '0');
//        const mm = String(d.getMonth() + 1).padStart(2, '0');
//        const yyyy = d.getFullYear();
//        return `${yyyy}/${mm}/${dd}`;
// }

