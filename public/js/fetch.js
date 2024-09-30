let response = async function displayProductsAtHomePage () {

    await fetch("http://localhost:8900/watch/hotProducts")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then( fetchedData => {
            displayTopSold(fetchedData.data);
        })
        .catch((error) => console.error("Fetching error: ", error));

     function displayTopSold (data) {
        const watchImages = document.querySelectorAll(".carousel .product-line .item img");
        const watchCaption = document.querySelectorAll(".carousel .product-line .item");
        const watchBrand = document.querySelectorAll(".carousel .product-line .item .brand");
        data.forEach( (watch, index) => {
            watchImages[index].src = `http://localhost:8900/${watch.image_path}`;
            watchImages[index].alt = `${watch.brand} ${watch.model_name}`;
            watchCaption[index].setAttribute("data-text", `${watch.model_name}`);
            watchBrand[index].innerHTML = `${watch.brand}`;
        });
    };

    await fetch("http://localhost:8900/watch/newArrivals")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then( fetchedData => {
            console.log(fetchedData.data);
            displayNewArrivals(fetchedData.data);
        })
        .catch((error) => console.error("Fetching error: ", error));

    function displayNewArrivals (data) {
        const hexagons = document.querySelectorAll(".hexagons div img");
        const caption = document.querySelector(".img-caption");
        const captionBrand = document.querySelector(".img-caption h2");
        const captionModel = document.querySelector(".img-caption p");
        data.forEach( (watch, index) => {
            hexagons[index].src = `http://localhost:8900/${watch.image_path}`;
            hexagons[index].alt = `${watch.brand} ${watch.model_name}`;
            hexagons[index].addEventListener("mouseenter", (e) => {
                caption.setAttribute("style", "opacity: 1");

                let altText = e.target.alt;
                let stringBeforeSpace = altText.slice(0, altText.indexOf(" "));
                let stringAfterSpace = altText.slice(altText.indexOf(" "), altText.length);
                captionBrand.innerHTML = stringBeforeSpace;
                captionModel.innerHTML = stringAfterSpace;
            });
            hexagons[index].addEventListener("mouseleave", () => {
                caption.setAttribute("style", "opacity: 0");
            });
        });
    };
};