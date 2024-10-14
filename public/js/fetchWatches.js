async function displayProductsAtHomePage () {

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
            // watchImages[index].src = `http://impetus-go.me/${watch.image_path}`;
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
            // hexagons[index].src = `https://impetus-go.me/${watch.image_path}`;
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
            renderingWatches(fetchedData.data);
            setBrandFilter(fetchedData.data);
            rankPrice(fetchedData.data);
        })
        .catch((error) => console.log("Fetching error: ", error));

    function renderingWatches (data) {

        const mainboard = document.getElementById("catalogue");
        const displayBoard = document.createElement("div");
        mainboard.appendChild(displayBoard);
        displayBoard.setAttribute("id", "display-board");
        displayBoard.classList.add("style-for-centering");

        data.forEach( (watch) => {
            const watchCard = document.createElement("div");
            const itemDiv = document.createElement("div");
            const viewBtn = document.createElement("button");

            const watchImage = document.createElement("img");
            const itemDoc = document.createElement("div");

            const watchBrand = document.createElement("h2");
            const watchModel = document.createElement("p");
            const watchPrice = document.createElement("h1");

            displayBoard.appendChild(watchCard);
            watchCard.appendChild(itemDiv);
            watchCard.appendChild(viewBtn);

            itemDiv.appendChild(watchImage);
            itemDiv.appendChild(itemDoc);

            itemDoc.appendChild(watchBrand);
            itemDoc.appendChild(watchModel);
            itemDoc.appendChild(watchPrice);

            watchCard.classList.add("watch-card");
            itemDiv.classList.add("watch-item");
            itemDoc.classList.add("watch-info");

            watchImage.src = `http://localhost:8900/${watch.image_path}`;
            // watchImage.src = `https://impetus-go.me/${watch.image_path}`;
            watchImage.alt = `${watch.brand} ${watch.model_name}`;

            watchBrand.innerHTML = watch.brand;
            watchModel.innerHTML = watch.model_name;
            watchPrice.innerHTML = "HK$ " + watch.current_price;
            viewBtn.innerHTML = "View Details";
        });
    };

    function setBrandFilter (data) {
        let retrieveBrands = [...new Set (data.map( (watch) => watch.brand ))];
        const brandFilter = document.getElementById("brand-filter");
        const listOfBrands = document.createElement("div");
        brandFilter.appendChild(listOfBrands);
        listOfBrands.setAttribute("id", "brand-list");
        listOfBrands.classList.add("style-for-centering");

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

            brandText.addEventListener("click", (e) => {
                document.getElementById("undo-filter")?.remove();

                let brandName = e.target.textContent;
                let filteredWatches = data.filter( (watch) => watch.brand === brandName);
                document.getElementById("display-board").remove();

                renderingWatches(filteredWatches);
                rankPrice(filteredWatches);

                const resetBtn = document.createElement("button");
                listOfBrands.appendChild(resetBtn);
                resetBtn.innerHTML = "Reset";
                resetBtn.setAttribute("id", "undo-filter");
                resetBtn.classList.add("brand");

                resetBtn.addEventListener("click", () => {
                    document.getElementById("display-board").remove();
                    renderingWatches(data);
                    rankPrice(data);
                    resetBtn.remove();
                });
            });
        });
    };

    function rankPrice (value) {

        let selectMenu = document.getElementById("select-menu");
        selectMenu.addEventListener("change", selectSort);

        function selectSort () {
            const switchValue = this.value;

            if (switchValue === "low-to-high") {
                document.getElementById("display-board")?.remove();

                let sortedData = value.sort( ( x, y ) => x.current_price - y.current_price );
                renderingWatches(sortedData);

            } else if (switchValue === "high-to-low") {
                document.getElementById("display-board")?.remove();

                let sortedData = value.sort( ( x, y ) => y.current_price - x.current_price);
                renderingWatches(sortedData);

            } else {
                return;
            };
        };
    };
};