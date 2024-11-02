let ourClient;

async function getUser () {
  let res = await fetch("/user");
  let json = await res.json();
  ourClient = json.username;
}

async function displaySalesRecord () {

    await fetch("/sales/record")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network error. No response from server.");
            }
        }).
        then(
          fetchedData => {
            console.log("Fetching success: ", fetchedData)

            presentingSalesContent(fetchedData.record);
        }
      )
      .catch((error) => console.log("Fetching error: ", error));
}

function presentingSalesContent (data) {
  console.log(data.length);
  // if ( data.length > 0 ) {

  // }

  const mainBoard = document.getElementById("user-record-board");

  const salesTable = document.createElement("table");

  const headRow = document.createElement("thead");
  const trHead = document.createElement("tr");

  const bodyData = document.createElement("tbody");
  const caption = document.createElement("caption");

  caption.innerText = `Sales Record of ${ourClient}`;
  salesTable.appendChild(caption);

  headRow.appendChild(trHead);
  salesTable.appendChild(headRow);
  mainBoard.appendChild(salesTable);

  const colNames = ["Sales No.", "Brand", "Model", "Model No.", "Purchase Price", "Order Date", "Order Status"];
  for ( let col of colNames ) {
      const th = document.createElement("th");
      th.innerText = col;
      trHead.appendChild(th);
  };

  for ( let itemData of data ) {
    const tr = document.createElement("tr");
    for ( let cellData in itemData) {
        const td = document.createElement("td");
        td.innerText = itemData[cellData];
        tr.appendChild(td);
    };
    bodyData.appendChild(tr);
};

salesTable.appendChild(bodyData);



}


{/* <table>
  <thead>
    <tr>
      <th>Person</th>
      <th>Amount</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Person1</td>
      <td>$5.99</td>
      <td>02/03/09</td>
    </tr>
    <tr>
      <td>Person2</td>
      <td>$12.99</td>
      <td>08/15/09</td>
    </tr>
  </tbody>
</table> */}



// function addCell(content) {
//   let td = document.createElement("td");
//   let a = document.createElement("a");
//   a.href = "user_request.html?id=" + order.id;
//   a.textContent = content;

//   td.appendChild(a);
//   tr.appendChild(td);
// }

