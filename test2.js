let dateArr = ["2023-10-20", "2022-11-18", "2018-03-14", "2020-01-03", "2023-01-30", "2023-05-26"];
let sortedDateArr = dateArr.sort((a, b) => {
  return new Date(a) - new Date(b);
});



let obj = {};
let arr = [];
let str;
let space = " ";

console.log(typeof obj, " : ", obj);
console.log(typeof arr, " : ", arr);
console.log(typeof str, " : ", str);
console.log(typeof space, " : ", space);
console.log(str == 0);
console.log(str === undefined);
console.log(str === NaN);
console.log(str === null);