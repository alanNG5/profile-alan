// let currency = "HK$365,500"

// let temp = currency.replace(/[^0-9.]+/g, "");
// console.log(typeof temp);
// console.log(parseInt(currency.replace(/[^0-9.]+/g, "")));

// let reg = /[0-9.]{3,5}/g;
// let str = "HK$518,652,923.86";

// result = str.match(reg);
// console.log("result: ", result);
// console.log(typeof result[0]);

// for (let i=0; i<result.length; i++) {
//     console.log(result[i]);
// };

// let joinArr = result.join("");
// console.log(typeof Number(joinArr));


let obj = {
    "brand": "Apple",
    "model_name": "iPhone 12 Pro Max",
    "current_price": "HK$5,500",
    "id": 1,
    "accountId": 1,
    "recipient": "John",
    "contact_no": "12345678",
    "shipping_address": "Flat 1, 2/F, Block A, 123 Main Street, Kowloon",
    "payment_method": "PayMe",
    "deal": false
}

let x = (obj.deal) ? console.log("sold") : console.log("pending");

let ts = [] + {};
let fx = {} + [];
console.log(ts, fx);

console.log(eval("({objx: 2})"));

+function ff() { console.log("+function ff():", "abc") }();
!function ff() { console.log("!function ff():", "xyz") }();
void function ff() { console.log("1999") }();

void function () {} ()
void function () {} ()


// let setPrevMon = new Date().setDate(0);
// let prevMon = new Date(setPrevMon).getMonth()+1;
// let yrOfPrevMon = new Date(setPrevMon).getFullYear();

// console.log("prev month: ", prevMon);
// console.log("yr of last mth: ", yrOfPrevMon);

// let set2MonAgo = new Date(new Date().getFullYear(), new Date().getMonth()-2, 1);
// console.log("set2MonAgo: ", set2MonAgo.toLocaleString());
// let  twoMonAgo = new Date(set2MonAgo).getMonth() + 1;
// let  yrOf2MonAgo = new Date(set2MonAgo).getFullYear();

// console.log("2 months before: ", twoMonAgo);
// console.log("yr of 2 months before: ", yrOf2MonAgo);

// let testing = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getMonth();
// let testing2 = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).getMonth();
// console.log("testing: ", testing);
// console.log("testing: ", testing2);


// Deep Copy: JSON.stsringify or Array.map with object spread or library called "lodash"
let z = [{a: 2, b: 10}, {a: 20, b: 30}];
// let q = JSON.parse(JSON.stringify(z));
let q = z.map(obj => ({...obj}));

q[0].b=256;
console.log("q: ", q);
console.log("z: ",z);

function arr(p1){
    console.log("yoyo: ", p1);
}

let tqqq = [["apple", 200],["tesla", 400],["google", 500]];
arr(...tqqq);