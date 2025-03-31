import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Load header and footer
loadHeaderFooter();

const dataSource = new ProductData();
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
await product.init(); // Assuming init is async and populates product data

// Set the breadcrumbs
const breadcrumbElement = document.querySelector(".breadcrumbs");
// Assuming product data is available at product.product after init()
const productData = product.product; 
if (breadcrumbElement && productData && productData.Category) {
  // Capitalize the first letter of the category
  const capitalizedCategory = productData.Category.charAt(0).toUpperCase() + productData.Category.slice(1);
  breadcrumbElement.innerHTML = capitalizedCategory;
}
