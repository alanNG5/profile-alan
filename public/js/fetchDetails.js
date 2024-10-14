window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    await fetch(`/watch/${id}`)
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error("Network error. No response from server.");
        }
    })
    .then(fetchedData => {
        show(fetchedData.data)
    })
    .catch((error) => console.log("Fetching error: ", error));

    function show (data) {
        console.log("fetching...:", data);
    }

};

