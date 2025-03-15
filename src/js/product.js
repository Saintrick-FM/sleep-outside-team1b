/* eslint-disable quotes */
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  // check if cart items is an array
  if (Array.isArray(cartItems)) {
    cartItems.push(product);
    setLocalStorage("so-cart", cartItems);
  } else {
    setLocalStorage("so-cart", [product]); // if it's not an array, create one with the product and save it
  }
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
