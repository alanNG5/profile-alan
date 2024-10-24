let urlCurrent = "http://localhost:8900/";
// urlCurrent = "https://impetus-go.me/";

let infoPurchaseAction = {};

window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if(id) {
        // adding a cache-busting parameter to URL:
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


        // setting up the zoom effect on the image:
        let imageZoom = document.getElementById("image-zoom");

        imageZoom.addEventListener("mousemove", (event) => {

            imageZoom.style.setProperty("--url", `url(${urlCurrent}${data[0].image_path})`);
            imageZoom.style.setProperty("--display", "block");

            let pointer = {
                x: (event.offsetX * 100) / imageZoom.offsetWidth,
                y: (event.offsetY * 100) / imageZoom.offsetHeight
                // offsetX is the distance from element's left margin to the cursor; offsetY is the distance from to margin to the cursor. These values are then divided by elements' width or height and change to % in data format. So we will have mouse position in unit.
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
        document.getElementById("purchase-item").innerHTML = infoPurchaseAction.brand + " " + infoPurchaseAction.model_name + " " + infoPurchaseAction.model_no;
        document.getElementById("purchase-price").innerHTML = infoPurchaseAction.current_price;

        infoPurchaseAction = {
            ...infoPurchaseAction,
            ...jsonUser
        };
    };
};

document.getElementById("buy-cancel").addEventListener("click", () => {
    buyModal.style.display = "none";
});
document.getElementById("cancel-buy-form").addEventListener("click", () => {
    buyModal.style.display = "none";
});

document.getElementById("submit-buy-form").addEventListener("click", () => {

  let pid = infoPurchaseAction.id;
  let paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  let buyForm = document.getElementById("buy-form");

  infoPurchaseAction = {
      ...infoPurchaseAction,
      recipient: buyForm.receiver.value,
      contact_no: buyForm.phone.value,
      shipping_address: buyForm.address.value,
  };

  console.log("object of purchase info:", infoPurchaseAction);
  console.log("object length: ", Object.keys(infoPurchaseAction).length);

  Swal.fire({
      title: "Confirm to buy?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch("/sales/newOrder" , {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // id as product_id; accountId as user_id
              id: pid,
              accountId: infoPurchaseAction.accountId,
              current_price: infoPurchaseAction.current_price,
              recipient: infoPurchaseAction.recipient,
              contact_no: infoPurchaseAction.contact_no,
              shipping_address: infoPurchaseAction.shipping_address,
              payment_method: paymentMethod,

            })
          });

          if (!response.ok) {
            return Swal.showValidationMessage(`
              ${JSON.stringify(await response.json())}
            `);
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
    // .then((result) => {
    //   if (result.isConfirmed) {

    //     Swal.fire({
    //       title: `${result.value.login}'s avatar`,
    //       imageUrl: result.value.avatar_url
    //     });
    //   }
    // });

  // alert("Thank you for your purchase!");


});


// fetch('https://api.example.com/items', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     name: 'NewItem',
//     description: 'This is a new item.'
//   })
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));