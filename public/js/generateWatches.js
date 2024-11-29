
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
        const watchImages = document.querySelectorAll(".carousel .product-line .item a img");
        const imageLinks = document.querySelectorAll(".carousel .product-line .item a");
        const watchCaptions = document.querySelectorAll(".carousel .product-line .item");
        const watchBrands = document.querySelectorAll(".carousel .product-line .item .brand");

        data.forEach( (watch, index) => {
            watchImages[index].src = `${urlCurrent}${watch.image_path}`;
            watchImages[index].alt = `${watch.brand} ${watch.model_name}`;
            imageLinks[index].href = `${urlCurrent}watch_details.html?id=${watch.id}`
            imageLinks[index].setAttribute("tabindex", "-1");
            watchCaptions[index].setAttribute("data-text", `${watch.model_name}`);
            watchBrands[index].innerHTML = `${watch.brand}`;
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
        const hexagons = document.querySelectorAll(".hexagons div a img");
        const hexaImageLinks = document.querySelectorAll(".hexagons div a");
        const caption = document.querySelector(".img-caption");
        const captionBrand = document.querySelector(".img-caption h2");
        const captionModel = document.querySelector(".img-caption p");

        data.forEach( (watch, index) => {
            hexagons[index].src = `${urlCurrent}${watch.image_path}`;
            hexagons[index].alt = `${watch.brand} ${watch.model_name}`;
            hexaImageLinks[index].href = `${urlCurrent}watch_details.html?id=${watch.id}`
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
            const btn = document.createElement("button");
            const btnText = document.createElement("span");
            const btnLink = document.createElement("a");
            const effectDiv = document.createElement("div");

            const watchImage = document.createElement("img");
            const itemDoc = document.createElement("div");

            const watchBrand = document.createElement("h2");
            const watchModel = document.createElement("p");
            const watchPrice = document.createElement("h1");

            displayBoard.appendChild(watchCard);
            watchCard.appendChild(itemDiv);
            watchCard.appendChild(btn);
            btnLink.appendChild(btnText);
            btnLink.appendChild(effectDiv);
            btn.appendChild(btnLink);

            itemDiv.appendChild(watchImage);
            itemDiv.appendChild(itemDoc);

            itemDoc.appendChild(watchBrand);
            itemDoc.appendChild(watchModel);
            itemDoc.appendChild(watchPrice);

            watchCard.classList.add("watch-card");
            itemDiv.classList.add("watch-item");
            itemDoc.classList.add("watch-info");
            btn.classList.add("view-btn");
            btnText.innerHTML = "View Details";
            effectDiv.classList.add("wave");

            watchImage.src = `${urlCurrent}${watch.image_path}`;
            watchImage.alt = `${watch.brand} ${watch.model_name}`;

            watchBrand.innerHTML = watch.brand;
            watchModel.innerHTML = watch.model_name;
            watchPrice.innerHTML = "HK$ " + watch.current_price.toLocaleString();

            btnLink.href = `${urlCurrent}watch_details.html?id=${watch.id}`;
            // @ avoid using addEventListener inside forEach iteration as possible
            // btn.addEventListener("click", () => {
            //     window.location.href = `${urlCurrent}watch_details.html?id=${watch.id}`;
            // });
        });
    };

    function setBrandFilter (data) {
        let retrieveBrands = [...new Set (data.map( (watch) => watch.brand ))];
        const brandFilter = document.getElementById("brand-filter");
        const listOfBrands = document.createElement("div");
        brandFilter.classList.add("style-for-centering");
        brandFilter.appendChild(listOfBrands);
        listOfBrands.setAttribute("id", "brand-list");


        retrieveBrands.forEach( (brand) => {
            const brandTag = document.createElement("div");

            listOfBrands.appendChild(brandTag);

            brandTag.classList.add("brand");
            brandTag.innerHTML = brand;
        });

        listOfBrands.addEventListener("click", (event) => {

            document.getElementById("undo-filter")?.remove();
            document.querySelector(".selected")?.classList.remove("selected");

            if(event.target.matches(".brand")) {

                let brandName = event.target.textContent;
                let filteredWatches = data.filter( (watch) => watch.brand === brandName);
                document.getElementById("display-board").remove();

                renderingWatches(filteredWatches);
                rankPrice(filteredWatches);

                const reset = document.createElement("div");
                listOfBrands.appendChild(reset);
                reset.innerHTML = "Reset";
                reset.setAttribute("id", "undo-filter");

                reset.addEventListener("click", () => {
                    document.getElementById("display-board").remove();
                    renderingWatches(data);
                    rankPrice(data);
                    reset.remove();
                });

                event.target.classList.toggle("selected");
            };
        });


        // @ hidden select meun displayed on small screen
        const select = document.getElementById("rwd-menu-brand");
        retrieveBrands.forEach( (brand) => {
            const option = document.createElement("option");
            option.innerText = brand;
            select.appendChild(option);
        });

        select.addEventListener("change", (event) => {
                let brandName = event.target.value;
                let selectText = document.getElementById("for-all-brands");
                selectText.style.display = "block";

                selectText.innerText = "All Brands";

                let filteredWatches = data.filter( (watch) => watch.brand === brandName);
                document.getElementById("display-board").remove();

                if (brandName === "All Brands") {
                    renderingWatches(data);
                    rankPrice(data);
                    selectText.style.display = "none";
                } else {
                    renderingWatches(filteredWatches);
                    rankPrice(filteredWatches);
                };
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