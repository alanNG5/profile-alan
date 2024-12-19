let checkbox = document.getElementById("pre-owned-checkBox");
checkbox.value = checkbox.checked;
checkbox.addEventListener("change", () => {
  checkbox.value = checkbox.checked;
});

let createItemForm = document.getElementById("create-item-form");

createItemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const res = await fetch(form.action, {
        method: form.method,
        headers: {
            Accept: "application/json",
        },
        body: formData,
    });

    // @ notes: not necessary to set Content-Type since the type is implied by the FormData class, the browser would automatically set it to multipart/form-data. Thus, JSON.stringify() is not required as data is not the content type of application/json.

    const result = await res.json();

    if (result.duplicatedItemMessage) {
        msgFailure(result.duplicatedItemMessage);
        return;
    }
    if (result.successMessage) {
        msgSuccess(result.successMessage);
        createItemForm.reset();
        return;
    }
    if (result.errorMessage) {
        msgFailure(result.errorMessage);
        return;
    }
});

