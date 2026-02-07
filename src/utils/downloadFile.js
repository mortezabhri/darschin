
export default function downloadFile(url, format, fileName = "darschin") {
       const a = document.createElement("a");
       a.href = url;
       a.download = `${fileName}.${format}`;
       a.click();
}