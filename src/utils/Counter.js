export default (s, e) => {
     if (Number(s) > Number(e)) return console.error("ERROR : Data Wrong!!");
     const arr = [];
     for (let i = Number(s); i < Number(e); i++) {
          arr.push(i);
     }
     return arr;
}