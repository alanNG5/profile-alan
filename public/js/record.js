getUser();
displaySalesRecord();

let ourClient = "Our Client";

async function getUser () {
  let res = await fetch("/user");
  let json = await res.json();
  ourClient = json?.username ?? ourClient;

  // ourClient = json.username;
  // ourClient = ourClient == undefined ? "Logged Out User" : ourClient;
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
};


function presentingSalesContent (data) {
  const mainBoard = document.getElementById("user-record-board");

  if ( data.length >= 1 ) {

    const salesTable = document.createElement("table");

    const headRow = document.createElement("thead");
    const trHead = document.createElement("tr");

    const bodyData = document.createElement("tbody");
    const caption = document.createElement("caption");

    caption.innerText = `Purchase Record of ${ourClient}`;
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
      // @ to adjust order status and parse price, and date to local string
      itemData.order_status = itemData.order_status === "delivered" ? "Delivered" : "Arranging Shipment";
      itemData.selling_price = "$ " + itemData.selling_price.toLocaleString();

      itemData.created_at = formatDate(itemData.created_at);

      let pid = itemData.pid;

      const tr = document.createElement("tr");
      for ( let cellData in itemData) {
          const td = document.createElement("td");

          if (cellData === "brand" || cellData === "model_name" || cellData === "model_no") {
            let hyperlink = document.createElement("a");
            hyperlink.href = `${urlCurrent}watch_details.html?id=${pid}`;
            hyperlink.innerText = itemData[cellData];
            td.appendChild(hyperlink);
          } else {
            td.innerText = itemData[cellData];
          }

          // @ "pid" is only used for the purpose of linking to the watch details page, so td about it is hidden.
          if (cellData === "pid") {
            td.style.display = "none";
          }

          tr.appendChild(td);
      };
      bodyData.appendChild(tr);
    };
      salesTable.appendChild(bodyData);

      const footer = document.createElement("tfoot");
      const tRow = document.createElement("tr");
      const td = document.createElement("td")

      let totalResult = `Found ${data.length} result.`;
      if (data.length > 1) {
        totalResult = totalResult.slice(0, -1) + "s.";
      }
      td.innerText = totalResult;
      td.setAttribute("colspan",7);
      tRow.appendChild(td);
      footer.appendChild(tRow);
      salesTable.appendChild(footer);

  } else {
    const noRecord = document.createElement("h2");
    noRecord.innerText = "No sales record found.";
    mainBoard.appendChild(noRecord);
    mainBoard.style.height = "80dvh";
    mainBoard.style.alignItems = "center";
  };
};

