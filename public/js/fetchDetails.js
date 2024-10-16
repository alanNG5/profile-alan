let urlCurrent = "http://localhost:8900/";
urlCurrent = "https://impetus-go.me/";

window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if(id) {
        // adding a cache-busting parameter to URL:
        // fetch(`/watch/${id}?_=${new Date().getTime()}`)

        await fetch(`/watch/${id}`)
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
            renderingDetails(fetchedData.data)
        })
        .catch((error) => {
            console.log("Fetching error: ", error);
            console.log("Response status: ", error.response?.status);
            console.log("Response text: ", error.response.json());
        });
    } else {
        console.log("No ID provided in URL.");
        window.location.href = "/404.html";
    };

    function renderingDetails (data) {

        const cardBrand = document.getElementById("card-brand");
        const cardModelName = document.getElementById("card-model-name");
        const cardModelNo = document.getElementById("card-model-no");
        const moreInfo = document.getElementById("more-info");
        const price = document.getElementById("price-current");
        const photo = document.getElementById("image-zoom");

        const createImg = document.createElement("img");
        photo.appendChild(createImg);

        createImg.src = `${urlCurrent}${data[0].image_path}`;
        createImg.alt = data[0].brand + " " + data[0].model_name;
        document.body.style.backgroundImage = `url(\"${createImg.src}\")`;

        cardBrand.innerHTML = data[0].brand;
        cardModelName.innerHTML = data[0].model_name;
        cardModelNo.innerHTML = data[0].model_no;
        price.innerHTML = data[0].current_price.toLocaleString("zh-HK", {style:"currency", currency:"HKD", maximumFractionDigits: 0});

        moreInfo.innerHTML = data[0].description;

    };
};
