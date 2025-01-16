fetchBrands();
let itemInfo = {};

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
                return response.json().then( errorData => { throw new Error (errorData.message);
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
        option.setAttribute("data-id", model.id);
        modelSelect.appendChild(option);
    });
};


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
            itemInfo = fetchedData.data[0];
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


    // @ message box about change made if any
    let msgContent = "Are you sure to update following information?\n\n";

    let compareP = itemInfo.current_price.toString() === objForm.searchPrice ? null : msgContent += `- Price changed from $ ${ itemInfo.current_price } to $ ${ objForm.searchPrice } .\n\n`;

    let compareQ = itemInfo.stock_qtn.toString() === objForm.searchQtn ? null : msgContent += `- Quantity changed from ${ itemInfo.stock_qtn } to ${ objForm.searchQtn } .\n\n`;

    let compareD = itemInfo.description === objForm.searchDesc ? null : msgContent += `- Product description revised to: \n\" ${ objForm.searchDesc } \" .`;

    if (compareP === null && compareQ === null && compareD === null) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "You have not made any change.",
            showConfirmButton: true,
            width: 400,
        });
        return;
    };

    patchProductInfo(targetId, objForm, msgContent);

});

async function patchProductInfo (id, obj, msg) {

    swalMsgBox.fire({
        title: msg,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            try {
                const response = await fetch (`/admin/setProduct/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                    // @ finally the FormData class is restructured to an object, so Content-Type is set and body is stringified.
                });

                let json = await response.json();

                if (!response.ok) {
                    return Swal.showValidationMessage(
                      json.message || "Request failed: no response from server."
                    )};

                return json;

            } catch (error) {
                Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
            };
        }, allowOutsideClick: () => !Swal.isLoading()
    })
    .then((result) => {
        if (result.isConfirmed) {

            swalMsgBox.fire({
                position: "center",
                icon: "success",
                title: "Product information is updated successfully!",
                footer: `Updated at ${formatDate(result.value.updatedTime)}`,
                showConfirmButton: false,
            })

            submitUpdateForm.reset();
            clearOptions();

        };
    });
};

function clearOptions () {
    const optionsList = document.querySelectorAll("#model-pick option");
    optionsList.forEach(option => option.remove());
};

