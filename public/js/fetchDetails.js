
let infoPurchaseAction = {};

window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if(id) {
        // @ adding a cache-busting parameter to URL:
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
            renderingDetails(fetchedData.data);
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
        const reminder = document.querySelector("p.tag");

        const createImg = document.createElement("img");
        photo.appendChild(createImg);

        createImg.src = `${urlCurrent}${data[0].image_path}`;
        createImg.alt = data[0].brand + " " + data[0].model_name;
        document.body.style.backgroundImage = `url(\"${createImg.src}\")`;
        document.body.style.backgroundSize = "contain";
        document.body.style.backgroundPosition = "-25% 0%";

        cardBrand.innerHTML = data[0].brand;
        cardModelName.innerHTML = data[0].model_name;
        cardModelNo.innerHTML = data[0].model_no;
        price.innerHTML = data[0].current_price.toLocaleString("zh-HK", {style:"currency", currency:"HKD", maximumFractionDigits: 0});
        moreInfo.innerHTML = data[0].description;

        infoPurchaseAction = data[0];

        reminder.innerText = data[0].outOfStock ? "Out of Stock" : "Free Shipping";
        reminder.style.backgroundColor = data[0].outOfStock ? "red" : "var(--theme-main-alt)";

        // @ setting up the zoom effect on the image:
        let imageZoom = document.getElementById("image-zoom");

        imageZoom.addEventListener("mousemove", (event) => {

            imageZoom.style.setProperty("--url", `url(${urlCurrent}${data[0].image_path})`);
            imageZoom.style.setProperty("--display", "block");

            let pointer = {
                x: (event.offsetX * 100) / imageZoom.offsetWidth,
                y: (event.offsetY * 100) / imageZoom.offsetHeight
                // @ offsetX is the distance from element's left margin to the cursor; offsetY is the distance from to margin to the cursor. These values are then divided by elements' width or height and change to % in data format. So we will have mouse position in unit.
            };

            imageZoom.style.setProperty("--zoom-x", pointer.x + "%");
            imageZoom.style.setProperty("--zoom-y", pointer.y + "%");
            // console.log("pointer: ", pointer);
        });

        imageZoom.addEventListener("mouseout", () => {
            imageZoom.style.setProperty("--display", "none");
        });

    };
};

const buyModal = document.getElementById("buy-modal");

document.getElementById("buy-form-popup-btn").addEventListener("click", forMemberActionOnly);

async function forMemberActionOnly () {
    let res = await fetch("/user");
    let jsonUser = await res.json();

    if ( jsonUser.visitor != "member" ) {
        Swal.fire({
            position: "center",
            icon: "info",
            iconColor: "var(--color-supp)",
            title: "Please login as a member to proceed.",
            showConfirmButton: true,
          });
    } else {
        buyModal.style.display = "block";
        document.getElementById("acname").innerHTML = jsonUser.username;
        document.getElementById("purchase-item-brand").innerHTML = infoPurchaseAction.brand;
        document.getElementById("purchase-item").innerHTML = infoPurchaseAction.model_name + " " + infoPurchaseAction.model_no;
        document.getElementById("purchase-price").innerHTML = "$ " + infoPurchaseAction.current_price.toLocaleString();

        infoPurchaseAction = {
            ...infoPurchaseAction,
            ...jsonUser
        };
    };
};


let cancelBuyModal = document.getElementsByClassName("cancel-buy-modal");
for (let i = 0; i < cancelBuyModal.length; i++) {
    cancelBuyModal[i].addEventListener("click", () => {
        buyModal.style.display = "none";
    });
}

document.getElementById("submit-buy-form").addEventListener("click", () => {

  let paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  let buyForm = document.getElementById("buy-form");

  // @ input validation for empty fields & non-numeric character in contact number:
  let inputsAboutShipment = document.getElementsByClassName("for-input-validating");
  let inputErrMsg = "";

  for (let i = 0; i < inputsAboutShipment.length; i++) {
    if (inputsAboutShipment[i].value === "") {
      inputErrMsg += "> " + inputsAboutShipment[i].name + " is missing.\n";
    };
  };

  const regexPhone = /^[0-9]*$/;

  if (!regexPhone.test(buyForm.phone.value)) {
    inputErrMsg += "> Non-numeric character(s) found in the Contact Number.";
  }

  if (inputErrMsg !== "") {
    inputErrMsg = "Input error(s) found in the form: " + "\n\n" + inputErrMsg;

    const inputErrMessage = Swal.mixin({
      customClass: {
        title: "confirm-deal-msg",
      },
    });

    inputErrMessage.fire({
      position: "center",
      icon: "error",
      title: inputErrMsg,
      showConfirmButton: true,
    });
    return;
  // @ validation ended.

  } else {

  infoPurchaseAction = {
      ...infoPurchaseAction,
      recipient: buyForm.receiver.value,
      contact_no: buyForm.phone.value,
      shipping_address: buyForm.address.value,
  };

  Swal.fire({
      title: `Confirm to buy ${infoPurchaseAction.brand} ${infoPurchaseAction.model_name} at HK$ ${infoPurchaseAction.current_price}?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch("/sales/record" , {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // @ pid as product_id; accountId as user_id
              pid: infoPurchaseAction.id,
              accountId: infoPurchaseAction.accountId,
              current_price: infoPurchaseAction.current_price,
              recipient: infoPurchaseAction.recipient,
              contact_no: infoPurchaseAction.contact_no,
              shipping_address: infoPurchaseAction.shipping_address,
              payment_method: paymentMethod,
            })
          });

          let json = await response.json();

          if (!response.ok) {
            return Swal.showValidationMessage(
              json.errorMessage || "Request failed: no response from server."
            );
          } else {
                buyForm.reset();
                buyModal.style.display = "none";
                return json;
          }
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        };
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
    .then((result) => {
      if (result.isConfirmed) {
        // console.log(result.value.outOfStockMessage);

        if(result.value.outOfStockMessage) {
          let warningAboutStock = "Product is out of stock.";
          msgFailure(warningAboutStock);

        } else {

          const confirmedMessage = Swal.mixin({
            customClass: {
              title: "confirm-deal-msg",
            },
          });

          confirmedMessage.fire({
            imageUrl: "./images/super-watcher.jpg",
            imageWidth: 300,
            imageAlt: "Deal is Sealed!",
            title: `Thank you for your purchase!\n\n${result.value.success}\n\nOnce the payment validation is complete, we will promptly contact you to discuss the shipment details.\n\nIf you have any questions, please feel free to reach out to us.`,
            width: 400,
          });

        }
      }
    });
  };
});