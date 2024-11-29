fetchInventoryLevel();

async function fetchInventoryLevel() {
    await fetch ("/admin/inventoryLv")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then( errorData => { throw new Error (errorData.message);
                })
            }
        })
        .then( (fetchedData) => {
            displayShortage(fetchedData.inventoryLevel);
        })
        .catch( error => console.error("Error from fetching inventory record: ", error));
}


function displayShortage (data) {
    let inventoryLevel = 5;
    let lowInventory = data.filter( item => item.stock_qtn <= inventoryLevel);

    let shortageTable = document.getElementById("shortage-table");
    let tBody = document.querySelector("#shortage-table tbody");

    for ( let item of lowInventory ) {
        let tr = document.createElement("tr");

        for ( let cell in item ) {
                let td = document.createElement("td");
                td.innerText = item[cell];
                tr.appendChild(td);
                if (cell === "stock_qtn") {
                    if (item[cell] < 1) {
                        tr.style.color = "red";
                    }
                }
        };
        tBody.appendChild(tr);
    };
    shortageTable.appendChild(tBody);
};