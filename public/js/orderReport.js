
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

  let devTable = document.querySelector("#delivery-summary-table table");

  const devTBody = document.createElement("tbody");

  for ( let row of data) {
    const tr = document.createElement("tr");
    row.order_status = row.order_status === "delivered" ? "Delivered" : row.order_status === "shipment_arranging" ? "Pending" : row.order_status;
      for ( let item in row) {
        const td = document.createElement("td");
        td.innerText = row[item];
        tr.appendChild(td);
      };
    devTBody.appendChild(tr);
  };

  devTable.appendChild(devTBody);
};


let spanAboutMonths = document.querySelectorAll("#delivery-summary-table table th:has(span) b");
let spanAboutMonths2 = document.querySelectorAll("#turnover-table table th:has(span) b");

function insertMonthYearCode (selector) {
  for ( let i = 0; i < selector.length; i++) {
      let span = document.createElement("span");
      span.innerText = `${arrOfRecentMonths[i].monCode} ${arrOfRecentMonths[i].yrIndex.toString().slice(-2)}`;
      selector[i].appendChild(span);
    };
}

insertMonthYearCode(spanAboutMonths);
insertMonthYearCode(spanAboutMonths2);