import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Initialize the product list
const productData = new ProductData("tents");
const element = document.querySelector(".products");
const listing = new ProductList("tents", productData, element);

listing.init();
