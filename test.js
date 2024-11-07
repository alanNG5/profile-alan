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

+function ff() { console.log("abc") }();
!function ff() { console.log("xyz") }();
void function ff() { console.log("1999") }();

void function () {} ()
void function () {} ()


