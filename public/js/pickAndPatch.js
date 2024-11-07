
async function fetchBrands() {
    await fetch ("/watch/showBrands")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then( errorData => { throw new Error( errorData.message);
                })
            }
    })
    .then( fetchedData => {
        insertBrandsIntoSelectOption(fetchedData.brandList);
    })
    .catch( error => console.error("Fetching error: ", error));
};


function insertBrandsIntoSelectOption (data) {
    const brandSelect = document.getElementById("brand-pick");

    data.forEach ( function (brand) {
        const option = document.createElement("option");
        option.value = brand.brand;
        option.innerText = brand.brand;
        brandSelect.appendChild(option);
    });
};