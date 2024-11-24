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

    const itemPendingToBeDelivered = dataset.sort((a, b) => {
        return a.sid - b.sid;
    }).filter( item => {
        return item.order_status === "shipment_arranging";
    });
    return itemPendingToBeDelivered.map( obj => ({...obj}));

    // @ Caution: Deep Copy!
    // swift to selective deep copy if possible
    // Other methods for deep copy are: JSON.parse(JSON.stringify(arrayOfObjects)) and library like "lodash"
    // JSON.stsringify not recommended because it involves serialization and deserialization processesor; and it causes loss of functionality of object like Dates:

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

// @ Push filtered data into array for appending to table
let turnoverStats = [];
let topBrand = [];
let topModel = [];

function filterDataByMonth (data) {
    for (let monthYear of arrOfRecentMonths) {
        let filteredData = data.filter( item => {
            let dateOfSales = new Date(item.created_at);
            return dateOfSales.getMonth() === monthYear.monIndex && dateOfSales.getFullYear() === monthYear.yrIndex;
        });

        getSalesBalance(filteredData);
        getLeadingStats(filteredData, "brand", topBrand);
        getLeadingStats(filteredData, "model_name", topModel);
    };
    // @ push the stats for recent 3 months into the arrays
    turnoverStats.push(turnoverStats.reduce(( accumulator, eachSum ) => { return accumulator + eachSum}, 0));
    turnoverStats = turnoverStats.map( stats => "$ " + stats.toLocaleString() );

    getLeadingStats(data, "brand", topBrand);
    getLeadingStats(data, "model_name", topModel);

    // @ formulating the table
    appendDataToTable(...turnoverStats);
    document.querySelector("#sales-performance-table tbody tr:nth-of-type(1)").insertCell(0).innerText = "Turnover";

    appendDataToTable(...topBrand);
    document.querySelector("#sales-performance-table tbody tr:nth-of-type(2)").insertCell(0).innerText = "Best Brand";

    appendDataToTable(...topModel);
    document.querySelector("#sales-performance-table tbody tr:nth-of-type(3)").insertCell(0).innerText = "Best Model";
};

function getSalesBalance (dataForSum) {

    let displaySum = dataForSum.length > 0 ?
    dataForSum.map( item => item.selling_price).reduce((accumulator, eachPrice) => {
        // @ selling_price returned is already a number
        return accumulator + eachPrice;
    })
    : 0;
    turnoverStats.push(displaySum);
};


function getLeadingStats (data, criteria, targetArray) {
    // @ generating an object with brand as key and frequency as value
    let listFrequentBrand = data.length > 0 ? data.reduce((acc, cur) => {
            let thisProperty = cur[criteria];
            acc[thisProperty] = (acc[thisProperty] || 0) + 1;
            return acc;
        }, {} ) : {};

    // @ converting object to array of arrays and sorting by frequency
    let getMostFrequentBrand = Object.entries(listFrequentBrand).sort((a,b) => b[1] - a[1]);

    getMostFrequentBrand = getMostFrequentBrand.length > 0 ?
        targetArray.push(`${getMostFrequentBrand[0][0]} ( ${getMostFrequentBrand[0][1]} )`)
        : targetArray.push("-- Nil --");

    // let brandList = data.map( item => item.brand);
    // let brandCount = brandList.reduce((accumulator, brand) => {
    //     accumulator[brand] = (accumulator[brand] || 0) + 1;
    //     return accumulator;
    // }, {});

    // let maxCount = Math.max(...Object.values(brandCount));
    // let mostFrequentBrand = Object.keys(brandCount).find( brand => brandCount[brand] === maxCount);
    // return mostFrequentBrand;

};

function appendDataToTable (value2MonAgo, valueLastMon, valueThisMon, recentInTotal) {
    let tBody = document.querySelector("#sales-performance-table tbody");
    let tr = document.createElement("tr");
    tr.insertCell(0).innerText = value2MonAgo;
    tr.insertCell(-1).innerText = valueLastMon;
    tr.insertCell(-1).innerText = valueThisMon;
    tr.insertCell(-1).innerText = recentInTotal;
    tBody.appendChild(tr);
};
