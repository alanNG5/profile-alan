
let response = async function displayProductsAtHomePage () {

    await fetch("/watch/hotProducts")
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

    await fetch("watch/newArrivals")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then( fetchedData => {
            // console.log(fetchedData.data);
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

async function displayWatches () {
    await fetch ("/watch")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network error. No response from server.");
            }
        })
        .then( fetchedData => {
            // console.log(fetchedData.data);
            handlingDataOfWatches(fetchedData.data);
        })
        .catch((error) => console.log("Fetching error: ", error));

    function handlingDataOfWatches (data) {
        let retrieveBrands = [...new Set (data.map( (watch) => watch.brand ))];
        const listOfBrands = document.getElementById("brand-list");

        retrieveBrands.forEach( (brand) => {
            const brandTag = document.createElement("button");
            const brandText = document.createElement("span");
            const effectDiv = document.createElement("div");

            listOfBrands.appendChild(brandTag);
            brandTag.appendChild(brandText);
            brandTag.appendChild(effectDiv);

            brandTag.classList.add("brand");
            brandText.innerHTML = brand;
            effectDiv.classList.add("wave");

            brandText.setAttribute("data-brand", brand);
            brandText.addEventListener("click", (e) => {
                let brandName = e.target.getAttribute("data-brand");
                let filteredWatches = data.filter( (watch) => watch.brand === brandName);
                console.log(filteredWatches);
            });
        });

        const displayBoard = document.getElementById("display-board");
        data.forEach( (watch) => {
            const watchCard = document.createElement("div");
            const watchImage = document.createElement("img");
            const watchCaption = document.createElement("div");
            const watchBrand = document.createElement("h2");
            const watchModel = document.createElement("p");
            const watchPrice = document.createElement("p");

            displayBoard.appendChild(watchCard);
            watchCard.appendChild(watchImage);
            watchCard.appendChild(watchCaption);
            watchCaption.appendChild(watchBrand);
            watchCaption.appendChild(watchModel);
            watchCaption.appendChild(watchPrice);

            watchCard.classList.add("watch-card");
            watchImage.src = `http://localhost:8900/${watch.image_path}`;
            watchImage.alt = `${watch.brand} ${watch.model_name}`;
            watchCaption.classList.add("watch-caption");
            watchBrand.innerHTML = watch.brand;
            watchModel.innerHTML = watch.model_name;
            watchPrice.innerHTML = watch.current_price;
        });
    };
};
