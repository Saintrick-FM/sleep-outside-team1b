import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize the product list
const productData = new ProductData("tents");
const element = document.querySelector(".products");
const listing = new ProductList("tents", productData, element);

listing.init();
