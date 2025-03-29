import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Get the category from URL parameter
const category = getParam("category");

// Initialize the product list
const productData = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, productData, element);

// Set the category title
document.querySelector(".category-title").textContent =
  category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");

listing.init();
