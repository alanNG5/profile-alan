
let ourClient = "Our Client";

async function getUser () {
  let res = await fetch("/user");
  let json = await res.json();
  ourClient = json.username;
}

async function displaySalesRecord () {

    await fetch("/sales/record")
        .then( response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then( errorData => {
                  throw new Error( errorData.errorMessage );
                })
            }
        })
        .then(
          fetchedData => {
            presentingSalesContent(fetchedData.record);
        })
        .catch(function(error) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: error.message,
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              location.href = "/watch_main.html";
            });

        });
}


function presentingSalesContent (data) {
  const mainBoard = document.getElementById("user-record-board");

  if ( data.length >= 1 ) {

    const salesTable = document.createElement("table");

    const headRow = document.createElement("thead");
    const trHead = document.createElement("tr");

    const bodyData = document.createElement("tbody");
    const caption = document.createElement("caption");
    const remark = document.createElement("span");

    caption.innerText = `Purchase of ${ourClient}`;
    caption.appendChild(remark);
    remark.innerText = ` ( ${data.length} records found )`;
    salesTable.appendChild(caption);

    headRow.appendChild(trHead);
    salesTable.appendChild(headRow);
    salesTable.classList.add("style-for-centering");
    mainBoard.appendChild(salesTable);


    const colNames = ["Sales No.", "Brand", "Model", "Model No.", "Cost (HKD)", "Order Date", "Order Status"];
    for ( let col of colNames ) {
        const th = document.createElement("th");
        th.innerText = col;
        trHead.appendChild(th);
    };


    for ( let itemData of data ) {
      itemData.order_status = itemData.order_status === "delivered" ? "Delivered" : "Arranging Shipment";
      itemData.selling_price = "$ " + itemData.selling_price.toLocaleString();
      let pid = itemData.pid;

      const tr = document.createElement("tr");
      for ( let cellData in itemData) {
          const td = document.createElement("td");
          td.innerText = itemData[cellData];

          if (cellData === "pid") {
            td.style.display = "none";
          }

          // "pid" is only used for the purpose of linking to the watch details page, so td about it is hidden.

          if (cellData === "brand" || cellData === "model_name" || cellData === "model_no") {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => {
              location.href = `${urlCurrent}watch_details.html?id=${pid}`;
            });
          }
          tr.appendChild(td);
      };
      bodyData.appendChild(tr);
    };
      salesTable.appendChild(bodyData);

  } else {
    const noRecord = document.createElement("h2");
    noRecord.innerText = "No sales record found.";
    mainBoard.appendChild(noRecord);
    mainBoard.style.height = "80dvh";
    mainBoard.style.alignItems = "center";
  };
};

