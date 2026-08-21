export default function toPersianDigit(str) {
       const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
       if (str === "" || str === null || str === undefined) return "-";
       str = String(str);
       return str.replace(/\d/g, digit => persianDigits[digit]);
} 