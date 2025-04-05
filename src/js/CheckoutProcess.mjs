import { getLocalStorage, setLocalStorage } from "./utils.mjs"; // Added setLocalStorage import
import ExternalServices from "./ExternalServices.mjs"; // Import ExternalServices

const taxRate = 0.06; // 6% sales tax
const shippingBase = 10; // $10 for the first item
const shippingAdditional = 2; // $2 for each additional item

const services = new ExternalServices();
/**
 * Converts the formData object to a JSON object
 * @param {FormData} formData The FormData object to convert
 * @returns {Object} The JSON object representation of the FormData
 */
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const json = {};
  // Convert FormData entries to a simple object
  for (const [key, value] of formData.entries()) {
    json[key] = value;
  }
  return json;
}
// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process.
  // An Array.map would be perfect for this process.
  return items.map((item) => ({
    id: item.Id,
    name: item.Name, // Assuming Name includes brand, adjust if needed
    price: item.FinalPrice,
    quantity: 1, // Use stored quantity
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // localStorage key for cart items ('so-cart')
    this.outputSelector = outputSelector; // Target element selector for summary
    this.list = []; // Cart items
    this.itemTotal = 0; // Subtotal
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    // Initial calculation for tax/shipping/total can happen here or later
    // For now, let's calculate it based on initial cart load
    this.calculateOrdertotal();
  }

  calculateItemSummary() {
    // Calculate the total of all items in the cart based on quantity
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0,
    );
    // Display the subtotal
    this.displayOrderTotals(); // Update display after calculation
  }

  calculateOrdertotal() {
    // Calculate shipping
    if (this.list.length > 0) {
      // Calculate total quantity of items
      const totalQuantity = this.list.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0,
      );
      this.shipping = shippingBase + (totalQuantity - 1) * shippingAdditional;
    } else {
      this.shipping = 0;
    }

    // Calculate tax
    this.tax = this.itemTotal * taxRate;

    // Calculate final order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display all totals
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const outputElement = document.querySelector(this.outputSelector);
    if (outputElement) {
      const subtotalElement = outputElement.querySelector("#subtotal");
      const shippingElement = outputElement.querySelector("#shipping");
      const taxElement = outputElement.querySelector("#tax");
      const orderTotalElement = outputElement.querySelector("#orderTotal");

      if (subtotalElement)
        subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
      if (shippingElement)
        shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
      if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
      if (orderTotalElement)
        orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    // Build the data object
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);
      setLocalStorage(this.key, []); // Clear the cart in localStorage
      return response;
    } catch (err) {
      if (err.name === "servicesError" && typeof err.message === "object") {
        // Handle validation errors
        const errors = Object.values(err.message).filter(msg => msg); // Remove empty messages
        throw { name: "validationError", messages: errors };
      } else {
        // Handle other types of errors
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  }
}
