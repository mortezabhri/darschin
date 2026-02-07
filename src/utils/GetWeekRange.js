// Get Days In This Week
function GetThisWeekDateRange(input = new Date()) {
     const ref = (input instanceof Date) ? new Date(input) : new Date(input);
     // پاک‌سازی ساعت/دقیقه تا محاسبات روزانه مطمئن‌تر باشد
     ref.setHours(0, 0, 0, 0);

     // در جاوااسکریپت: 0 = یک‌شنبه, ... , 6 = شنبه
     const day = ref.getDay(); // 0..6
     // فاصله تا شنبه (index 6)
     const daysSinceSaturday = (day - 6 + 7) % 7;
     const saturday = new Date(ref);
     saturday.setDate(ref.getDate() - daysSinceSaturday);

     const pad = n => String(n).padStart(2, '0');
     const fmt = d => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;

     const week = [];
     for (let i = 0; i < 7; i++) {
          const dayD = new Date(saturday);
          dayD.setDate(saturday.getDate() + i);
          week.push(fmt(dayD));
     }
     return week;
}
// Get Days In Next Week
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const formatted = nextWeek.toISOString().slice(0, 10).replace(/-/g, '/');
function GetNextWeekDateRange() {
     const input = formatted;
     const ref = (input instanceof Date) ? new Date(input) : new Date(input);
     // پاک‌سازی ساعت/دقیقه تا محاسبات روزانه مطمئن‌تر باشد
     ref.setHours(0, 0, 0, 0);

     // در جاوااسکریپت: 0 = یک‌شنبه, ... , 6 = شنبه
     const day = ref.getDay(); // 0..6
     // فاصله تا شنبه (index 6)
     const daysSinceSaturday = (day - 6 + 7) % 7;
     const saturday = new Date(ref);
     saturday.setDate(ref.getDate() - daysSinceSaturday);

     const pad = n => String(n).padStart(2, '0');
     const fmt = d => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;

     const week = [];
     for (let i = 0; i < 7; i++) {
          const dayD = new Date(saturday);
          dayD.setDate(saturday.getDate() + i);
          week.push(fmt(dayD));
     }
     return week;
}

export { GetThisWeekDateRange  , GetNextWeekDateRange}