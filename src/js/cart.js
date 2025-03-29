import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

// Load header and footer
loadHeaderFooter();

// Get the cart list element
const cartList = document.querySelector(".product-list");
// Create an instance of ShoppingCart
const cart = new ShoppingCart(cartList);
// Load cart
cart.init();
