import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize the checkout process
const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

// Handle zip code changes to update shipping
document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrdertotal();
});

// Handle form submission
document.querySelector("#checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector("#checkoutSubmit");
  
  // Disable submit button to prevent double submission
  submitButton.disabled = true;
  submitButton.textContent = "Processing...";
  
  try {
    // Process the checkout
    await checkout.checkout(form);
    
    // Redirect to success page or show success message
    window.location.href = "/checkout/success.html";
  } catch (err) {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = "Place Order";
    
    // Show error message
    alert("There was an error processing your order. Please try again.");
  }
});
