// const parentList = document.getElementById("parent-list");
// parentList.addEventListener("click", (event) => {
//     if (event.target.match("li")) {
//         event.target.style.textDecoration="line-through"
//     }
// })

fetchDeliveryReport();

async function fetchDeliveryReport() {
    await fetch("/admin/report/delivery")
        .then( (response) => {
            if (!response.ok) {
                throw new Error("Request failed: no response from server.")
            } else {
                return response.json();
            }
        })
        .then( fetchedData =>
          generateReportOfDelivery(fetchedData.collectionStatus)
        )
        .catch( (error) =>
            console.error("Fetching error: ", error)
        );
}

function generateReportOfDelivery (data) {
  let devTable = document.getElementById("delivery-summary-table");

  const devTBody = document.createElement("tbody");

  for ( let row of data) {
    const tr = document.createElement("tr");
      for ( let item in row) {
        const td = document.createElement("td");
        td.innerText = row[item];
        tr.appendChild(td);
      };
    devTBody.appendChild(tr);
  };

  devTable.appendChild(devTBody);
};

console.log(refThisMonth);

let summary = {
    "collectionStatus": [
      {
        "order_status": "delivered",
        "two_months_ago": "5",
        "last_month": "1",
        "this_month": "0",
        "status_count": "6"
      },
      {
        "order_status": "shipment_arranging",
        "two_months_ago": "1",
        "last_month": "7",
        "this_month": "1",
        "status_count": "9"
      },
      {
        "order_status": "monthly_count",
        "two_months_ago": "6",
        "last_month": "8",
        "this_month": "1",
        "status_count": "15"
      }
    ]
  }