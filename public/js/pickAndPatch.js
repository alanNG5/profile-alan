fetchBrands();

// @ fetch all brands (distinct), then fetch all models for the selected brand
// @ finally PATCH the product details pertaining to the input fields

const brandSelect = document.getElementById("brand-pick");
const modelSelect = document.getElementById("model-pick");
const searchButton = document.getElementById("go-search");

// @ select brand
async function fetchBrands() {
    await fetch ("/admin/showBrands")
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


// @ corresponding model listed for selection after selection of brand
brandSelect.addEventListener("change", function() {

    modelSelect.inert = false;
    searchButton.inert = false;

    clearOptions();

    let selectedOption = this.value;

    fetchModels();

    async function fetchModels() {
        await fetch (`/admin/showModels/${selectedOption}`)
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


// @ patch form data
let submitUpdateForm = document.getElementById("update-item-form");
submitUpdateForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const updateFormData = new FormData(form);

    let targetId = updateFormData.get("searchID");

    // @ to create an object from a list of key/value pairs by Object.fromEntries.
    let objForm = Object.fromEntries(updateFormData.entries());
    objForm.searchPrice = objForm.searchPrice.replace(/[^0-9.]+/g, "");
    delete objForm.searchID;
    delete objForm.searchModNo;

    patchProductInfo(targetId, objForm);
    submitUpdateForm.reset();
    clearOptions();

});

async function patchProductInfo (id, obj) {
    await fetch (`/admin/setProduct/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then( errorData => { throw new Error( errorData.message);
            })
        }
    })
    .then( function (resJson) {
        const swalMsgBox = Swal.mixin({
            customClass: {
                title: "update-success-msg",
                footer: "update-time",
            },
        });

        swalMsgBox.fire({
            position: "center",
            icon: "success",
            title: resJson.message,
            footer: `Updated at ${formatDate(resJson.updatedTime)}`,
            showConfirmButton: false,
            width: 400,
        })
    })
    .catch( error => msgFailure(error));
};

function clearOptions () {
    const optionsList = document.querySelectorAll("#model-pick option");
    optionsList.forEach(option => option.remove());
}
