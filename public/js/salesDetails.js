window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if(id) {
        await fetch(`/admin/sales/order/${id}`)
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else if (response.status === 404) {
                console.log("No data found.");
                // window.location.href = "/404.html";
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then(fetchedData => {
            getAllSalesInfo(fetchedData.sales);
        })
        .catch((error) => {
            console.log("Fetching error: ", error);
            console.log("Response status: ", error.response?.status);
            console.log("Response text: ", error.response.json());
        });
}};


function getAllSalesInfo (data) {
    document.getElementById("sales-id").innerText = data[0].sid;
    document.getElementById("sales-create-date").innerText = formatDate(data[0].sales_created_at);
    document.getElementById("product-id").innerText = data[0].pid;
    document.getElementById("brand").innerText = data[0].brand;
    document.getElementById("model-name").innerText = data[0].model_name;
    document.getElementById("model-no").innerText = data[0].model_no;
    document.getElementById("payment-method").innerText = data[0].payment_method.toUpperCase();
    document.getElementById("selling-price").innerText = data[0].selling_price.toLocaleString("zh-HK", {style:"currency", currency:"HKD", maximumFractionDigits: 0});
    document.getElementById("current-price").innerText = data[0].current_price.toLocaleString("zh-HK", {style:"currency", currency:"HKD", maximumFractionDigits: 0});

    document.getElementById("user-id").innerText = data[0].uid;
    document.getElementById("username").innerText = data[0].username;
    document.getElementById("email").innerText = data[0].email;
    document.getElementById("user-create-date").innerText = formatDate(data[0].user_created_at);

    document.getElementById("contact-person").innerText = data[0].recipient;
    document.getElementById("contact-no").innerText = data[0].contact_no;
    document.getElementById("address").innerText = data[0].shipping_address;
    document.getElementById("delivery-status").innerText = data[0].order_status === "delivered" ? "Settled" : "Pending";
    document.getElementById("delivery-status").style.color = data[0].order_status === "delivered" ? "darkblue" : "red";

    document.getElementById("delivery-date").innerText = data[0].order_status === "delivered" ? formatDate(data[0].sales_updated_at) : "Not yet";
    document.getElementById("delivery-date").style.color = data[0].order_status === "delivered" ? "darkblue" : "red";
};

// "users.id AS uid",
// "username",
// "email",
// "users.created_at AS user_created_at",
// "products.id AS pid",
// "brand",
// "model_name",
// "model_no",
// "current_price",
// "sales.id AS sid",
// "selling_price",
// "recipient",
// "contact_no",
// "shipping_address",
// "payment_method",
// "order_status",
// "sales.created_at AS sales_created_at",
// "sales.updated_at AS sales_updated_at"
