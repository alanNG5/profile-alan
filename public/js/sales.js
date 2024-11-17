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
