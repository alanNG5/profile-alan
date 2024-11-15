fetchSales();

async function fetchSales() {
    await fetch ("/admin/sales/status")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then( errorData => { throw new Error (errorData.message);
                })
            }
        })
        .then( fetchedData => {
            recordOfPendingForDelivery(fetchedData.salesList);
        })
        .catch( error => console.error("Error from fetching sales record: ", error));
};

const deliveryBoard = document.getElementById("pending-record");

function recordOfPendingForDelivery (data) {
    const reorganizedData = dataHandler(data);

    const salesTable = document.createElement("table");

    const tHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    const hRow = document.createElement("tr");

    const colHead = ["Sales No.", "Username",  "Brand", "Model Name", "Date of Order", "Delivered"];
    for ( let col of colHead ) {
        const th = document.createElement("th");
        th.innerText = col;
        hRow.appendChild(th);
    };

    tHead.appendChild(hRow);
    salesTable.appendChild(tHead);
    deliveryBoard.appendChild(salesTable);

    const cellEntries = ["sid", "username", "brand", "model_name", "created_at"];

    for ( let item of reorganizedData) {
        item.created_at = formatDate(item.created_at);
        item.created_at = item.created_at.substring(0, 11);

        const tRow = document.createElement("tr");

        for ( let cell in item) {
            if (cellEntries.includes(cell)) {
                const td = document.createElement("td");
                td.innerText = item[cell];
                tRow.appendChild(td);
            };
        };
        let lastCell = tRow.insertCell(-1);
        lastCell.innerHTML = `<input type="checkbox" name="${item.sid}">`;
        tableBody.appendChild(tRow);
    };
    salesTable.appendChild(tableBody);


    let submitChangingDeliveryStatus = document.getElementById("change-status");
    submitChangingDeliveryStatus.addEventListener("click", clickToPatchArray);
};

function dataHandler (dataset) {
    const sortData = dataset.sort((a, b) => {
        return a.sid - b.sid;
    });

    return sortData.filter( item => {
        return item.order_status === "shipment_arranging";
    });
};


function clickToPatchArray (event)  {
    event.preventDefault();

    let selectedBox = document.querySelectorAll("#pending-record input:checked");
    let arrOfSelected = [];
    for (let item of selectedBox) {
        arrOfSelected.push(item.name);
    };

    if ( arrOfSelected.length < 1 ) {
        msgFailure("No Sales Order is selected.");
        return;
    };

    let orderSelection = { salesOrderChecked: arrOfSelected };

    fetch("/admin/sales/status", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderSelection)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then( errorData => { throw new Error (errorData.message);
            })
        }
    })
    .then( responseContent => {

        let watch = arrOfSelected.length > 1 ? "watches" : "watch";
        let order = arrOfSelected.length > 1 ? "orders" : "order";

        swalMsgBox.fire({
            position: "center",
            icon: "success",
            title: `Delivery of ${watch} confirmed; status of sales ${order} No. ${responseContent.updatedSalesDeliveryStatus} updated.`,
            footer: `Updated at ${formatDate(responseContent.updatedTime)}`,
            showConfirmButton: false,
            width: 400,
        });

    })
    .catch( error => console.error("Error from fetching sales record: ", error));

    // @ refresh the table
    deliveryBoard.removeChild(deliveryBoard.lastChild);
    fetchSales();

};



// const parentList = document.getElementById("parent-list");
// parentList.addEventListener("click", (event) => {
//     if (event.target.match("li")) {
//         event.target.style.textDecoration="line-through"
//     }
// })