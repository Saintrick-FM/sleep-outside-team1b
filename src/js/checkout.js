import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize the checkout process
const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Handle zip code changes to update shipping
document.querySelector("#zip").addEventListener("blur", () => {
  order.calculateOrdertotal();
});

// Handle form submission
document
  .querySelector("#checkoutSubmit")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const myForm = document.forms[0];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (!chk_status) return;
    const submitButton = myForm.querySelector("#checkoutSubmit");

    // Disable submit button to prevent double submission
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    try {
      // Process the checkout
      await order.checkout(myForm);
      
      // Redirect to success page on successful checkout
      window.location.href = "../checkout/success.html";
    } catch (err) {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Place Order";

      // Show error messages
      if (err.name === "validationError" && Array.isArray(err.messages)) {
        // Show each validation error as a separate alert
        err.messages.forEach((message, index) => {
          // Stagger the alerts slightly for better visibility
          setTimeout(() => {
            alertMessage(message, index === 0); // Only scroll for first error
          }, index * 100);
        });
      } else {
        // Show generic error
        alertMessage(err.message || "An unexpected error occurred", true);
      }
    }
  });
