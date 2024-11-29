window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if(id) {
        await fetch(`/admin/sales/order/${id}`)
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else if (response.status === 404) {
                window.location.href = "/404.html";
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then(fetchedData => {
            propsSalesInfo(fetchedData.data);
        })
        .catch((error) => {
            console.log("Fetching error: ", error);
            console.log("Response status: ", error.response?.status);
            console.log("Response text: ", error.response.json());
        });
}};


