let currency = "HK$365,500"

let temp = currency.replace(/[^0-9.]+/g, "");
console.log(typeof temp);
console.log(parseInt(currency.replace(/[^0-9.]+/g, "")));

// let reg = /[0-9.]{1,}/g;
// let str = "HK$5923.86";

// result = str.match(reg);
// console.log(result);
// console.log(typeof result[0]);
// for (let i=0; i<result.length; i++) {
//     console.log(result[i]);
// };

// let joinArr = result.join("");
// console.log(typeof Number(joinArr));