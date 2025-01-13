
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
                imageLinks[index].href = `${urlCurrent}watch_details.html?id=${watch.id}`;
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
        const captionPrice = document.querySelector(".img-caption .price-tag");

        const capShowingInfo = document.querySelectorAll(".hexagons p");
        const showBrand = document.querySelectorAll(".hexagons p span:first-of-type");
        const showModel = document.querySelectorAll(".hexagons p span:last-of-type");

        data.forEach( (watch, index) => {
            hexagons[index].src = `${urlCurrent}${watch.image_path}`;
            hexagons[index].alt = `${watch.brand} ${watch.model_name}`;
            hexaImageLinks[index].href = `${urlCurrent}watch_details.html?id=${watch.id}`;

            showBrand[index].innerText = `${watch.brand}`;
            showModel[index].innerText = `${watch.model_name}`;

            hexagons[index].addEventListener("mouseover", (e) => {

                capShowingInfo[index].setAttribute("style", "opacity: 1; z-index: 1000");
                capShowingInfo[index].style.setProperty("left", `${ e.target.offsetLeft + e.target.offsetWidth + 10}px`);
                capShowingInfo[index].style.setProperty("top", `${ hexagons[index].offsetTop + e.target.offsetHeight / 2 }px`);


                caption.setAttribute("style", "opacity: 1");
                captionPrice.innerText = `${watch.current_price.toLocaleString("zh-HK", { style: "currency", currency: "HKD", maximumFractionDigits: 0 })}`;

                // let altText = e.target.alt;
                // let stringBeforeSpace = altText.slice(0, altText.indexOf(" "));
                // let stringAfterSpace = altText.slice(altText.indexOf(" "), altText.length);
                // captionBrand.innerHTML = stringBeforeSpace;
                // captionModel.innerHTML = stringAfterSpace;
            });

            hexagons[index].addEventListener("mouseleave", () => {
                capShowingInfo[index].setAttribute("style", "opacity: 0");
                caption.setAttribute("style", "opacity: 0");
            });

        });
    };
};


const itemPerPage = 12;
let currentPage = 1;
let arrOfWatches = [];
let calTotalPage = function () {
    return Math.ceil(arrOfWatches.length / itemPerPage);
}
const displayBoard = document.getElementById("display-board");


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
            arrOfWatches = [...fetchedData.data];
            setBrandFilter(fetchedData.data);
        })
        .catch((error) => console.log("Fetching error: ", error));


    function setPagination () {
        let startIndex = (currentPage - 1) * itemPerPage;
        let endIndex = currentPage * itemPerPage;
        let pageData = arrOfWatches.slice(startIndex, endIndex);

        displayBoard.innerHTML = "";
        renderingWatches(pageData);

        document.querySelector("#current-page span:first-of-type").textContent = `Page ${currentPage}`;
        document.querySelector("#current-page span:last-of-type").textContent = ` / ${calTotalPage()}`;

        document.getElementById("prev-page-btn").style.display = currentPage === 1 ? "none" : "block";
        document.getElementById("next-page-btn").style.display = currentPage === calTotalPage() ? "none" : "block";
    };

    function turnPageButtons () {

        document.getElementById("prev-page-btn").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                setPagination();
            };
        });

        document.getElementById("next-page-btn").addEventListener("click", () => {
            if (currentPage < calTotalPage()) {
                currentPage++;
                setPagination();
            };
        });
    };


    function renderingWatches (data) {

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

        let defaultOption = document.querySelector("#catalogue #select-menu option:first-of-type");

        listOfBrands.addEventListener("click", (event) => {

            document.getElementById("undo-filter")?.remove();
            document.querySelector(".selected")?.classList.remove("selected");

            if(event.target.matches(".brand")) {

                let brandName = event.target.textContent;
                arrOfWatches = data.filter( (watch) => watch.brand === brandName);

                currentPage = 1;
                rankPrice();
                setPagination();

                defaultOption.selected = true;

                const reset = document.createElement("div");
                listOfBrands.appendChild(reset);
                reset.innerHTML = "Reset";
                reset.setAttribute("id", "undo-filter");

                reset.addEventListener("click", () => {
                    displayBoard.innerHTML = "";
                    arrOfWatches = [...data];
                    currentPage = 1;
                    setPagination();
                    rankPrice();
                    defaultOption.selected = true;
                    reset.remove();
                });

                event.target.classList.toggle("selected");
            };
        });


        // @ hidden select menu displayed on small screen
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

                arrOfWatches = data.filter( (watch) => watch.brand === brandName);
                displayBoard.innerHTML = "";

                if (brandName === "All Brands") {
                    displayBoard.innerHTML = "";
                    arrOfWatches = [...data];
                    currentPage = 1;
                    setPagination();
                    rankPrice();
                    defaultOption.selected = true;
                    selectText.style.display = "none";
                } else {
                    currentPage = 1;
                    setPagination();
                    rankPrice();
                    defaultOption.selected = true;
                };
        });
    };


    function rankPrice () {

        let selectMenu = document.getElementById("select-menu");
        selectMenu.addEventListener("change", selectSort);

        function selectSort () {
            const switchValue = this.value;

            if (switchValue === "low-to-high") {
                displayBoard.innerHTML = "";

                arrOfWatches.sort( ( x, y ) => x.current_price - y.current_price );
                currentPage = 1;
                setPagination();

            } else if (switchValue === "high-to-low") {
                displayBoard.innerHTML = "";

                arrOfWatches.sort( ( x, y ) => y.current_price - x.current_price);
                currentPage = 1;
                setPagination();

            } else {
                return;
            };
        };
    };

    setPagination();
    turnPageButtons();
    rankPrice();
};
