fetchBrands();

// fetch all brands (distinct), then fetch all models for the selected brand

const brandSelect = document.getElementById("brand-pick");
const modelSelect = document.getElementById("model-pick");
const searchButton = document.getElementById("go-search");

//
// select brand
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
    .catch( error => console.error("Error from fetching brand item: ", error));
};


function insertBrandsIntoSelectOption (data) {

    data.forEach ( brand => {
        const option = document.createElement("option");
        option.value = brand.brand;
        option.innerText = brand.brand;
        brandSelect.appendChild(option);
    });
};

//
// corresponding model listed for selection after selection of brand
brandSelect.addEventListener("change", function() {

    modelSelect.inert = false;
    searchButton.inert = false;

    const optionsList = document.querySelectorAll("#model-pick option");
    optionsList.forEach(option => option.remove());

    let selectedOption = this.value;

    fetchModels();

    async function fetchModels() {
        await fetch (`/watch/showModels/${selectedOption}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then( errorData => { throw new Error( errorData.message);
                    })
                }
            })
        .then( fetchedData => {
            insertModelsIntoSelectOption(fetchedData.modelList);
        })
        .catch( error => console.error("Error from fetching model item: ", error));
    }
});

function insertModelsIntoSelectOption (data) {

    data.forEach ( model => {
        const option = document.createElement("option");
        option.value = model.model_name;
        option.innerText = model.model_name;
        option.setAttribute("data-id", model.id); // products.id
        modelSelect.appendChild(option);
    });
}


searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    let productId = modelSelect.options[modelSelect.selectedIndex].getAttribute("data-id");

    fetchProductInfo(productId);

    async function fetchProductInfo(ptdId) {
        await fetch(`/watch/${ptdId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then( errorData => { throw new Error( errorData.message);
                    })
                }
            })
        .then( fetchedData => {
            renderProductInfo(fetchedData.data);
        })
        .catch( error => console.error("Error from fetching product item: ", error));
    }
});

function renderProductInfo (data) {
    document.getElementById("result-id").value = data[0].id;
    document.getElementById("result-model-no").value = data[0].model_no;
    document.getElementById("result-qtn").value = data[0].stock_qtn;
    document.getElementById("result-description").value = data[0].description;
    let properPriceFormat = data[0].current_price.toLocaleString("zh-HK");
    document.getElementById("result-price").value = properPriceFormat;
};
