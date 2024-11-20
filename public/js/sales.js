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
        .then( (fetchedData) => {
            generateRecordOfPendingForDelivery(fetchedData.salesList);
            filterDataByMonth(fetchedData.salesList);
        })
        .catch( error => console.error("Error from fetching sales record: ", error));
};

const deliveryBoard = document.getElementById("pending-record");

function generateRecordOfPendingForDelivery (data) {
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

    let deepCopy = dataset.map(obj => ({...obj}));
    // @ Caution: Deep Copy!
    // swift to selective deep copy if possible
    // Other methods for deep copy are: JSON.parse(JSON.stringify(arrayOfObjects)) and library like "lodash"
    // JSON.stsringify not recommended because it involves serialization and deserialization processesor; and it causes loss of functionality of object like Dates:

    const sortData = deepCopy.sort((a, b) => {
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

    let msgBeforePatch = `Please make sure that delivery is completed successfully.\n\nIf it's okay, please click "confirm" to update order status for Sales No.: #${arrOfSelected.join(" , #")} ?`;

    swalMsgBox.fire({
        title: msgBeforePatch,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            try {

                const response = await fetch("/admin/sales/status", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderSelection)
                });

                let json = await response.json();

                if (!response.ok) {
                    return Swal.showValidationMessage(
                      json.errorMessage || "Request failed: no response from server."
                    )};

                return json;

            } catch (error) {
                Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
            };
        }, allowOutsideClick: () => !Swal.isLoading()
    })
    .then((result) => {
        if (result.isConfirmed) {

            let watch = arrOfSelected.length > 1 ? "watches" : "watch";
            let order = arrOfSelected.length > 1 ? "orders" : "order";

            swalMsgBox.fire({
                position: "center",
                icon: "success",
                title: `Delivery of ${watch} confirmed;\n\nstatus of sales ${order} No. #${result.value.updatedSalesDeliveryStatus} updated.`,
                footer: `Updated at ${formatDate(result.value.updatedTime)}`,
                showConfirmButton: false,
            });

                // @ refresh the table
            deliveryBoard.removeChild(deliveryBoard.lastChild);
            fetchSales();

        };
    });


};

const unselect = document.getElementById("unselct-checkbox");
unselect.addEventListener("click", () => {
    let selectedBox = document.querySelectorAll("#pending-record input:checked");
    for (let item of selectedBox) {
        item.checked = false;
    };
});

let turnoverStats = [];

function filterDataByMonth (data) {

    for (let monthYear of arrOfRecentMonths) {
        let filteredData = data.filter( item => {
            let dateOfSales = new Date(item.created_at);
            return dateOfSales.getMonth() === monthYear.monIndex && dateOfSales.getFullYear() === monthYear.yrIndex;
        });
        generateSalesReport(filteredData);
    };

    turnoverStats.push(turnoverStats.reduce(( accumulator, eachSum ) => { return accumulator + eachSum}, 0));
    let turnoverDisplay = document.querySelectorAll("#turnover-table table tbody tr td:nth-child(n+2)");
    turnoverStats.forEach( (stats, index) => {
        turnoverDisplay[index].innerText = stats.toLocaleString();
    });
};

function generateSalesReport (dataForSum) {
    let displaySum = dataForSum.map( item => item.selling_price).reduce((accumulator, eachPrice) => {
        // @ selling_price returned is already a number
        return accumulator + eachPrice;
    });
    turnoverStats.push(displaySum);
};


let ff = {
"salesList": [
{
"sid": 101,
"uid": 3,
"username": "prudent",
"pid": 2,
"brand": "Seiko",
"model_name": "Lukia",
"model_no": "SSVW154",
"selling_price": 5200,
"created_at": "2024-09-05T07:35:21.003Z",
"order_status": "delivered",
"updated_at": "2024-09-05T07:35:21.003Z"
},
{
"sid": 102,
"uid": 2,
"username": "client101",
"pid": 9,
"brand": "Tudor",
"model_name": "Royal",
"model_no": "M28603-0001",
"selling_price": 30400,
"created_at": "2024-09-05T07:35:21.004Z",
"order_status": "delivered",
"updated_at": "2024-09-05T07:35:21.004Z"
}
]};