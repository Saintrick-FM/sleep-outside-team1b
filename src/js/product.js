import { getParam, loadHeaderFooter } from "./utils.mjs";

import ProductDetails from "./ProductDetails.mjs";
import ProductData from "./ExternalServices.mjs";

// Load header and footer
loadHeaderFooter();

const dataSource = new ProductData();
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);

// Initialize product and set breadcrumbs after data is loaded ****** Instead of setting a top-level await like  << const products = await myList.init(); >>
async function initialize() {
  await product.init(); // Wait for product data to be loaded

  // Set the breadcrumbs
  const breadcrumbElement = document.querySelector(".breadcrumbs");
  const productData = product.product;

  if (breadcrumbElement && productData && productData.Category) {
    // Capitalize the first letter of the category
    const capitalizedCategory =
      productData.Category.charAt(0).toUpperCase() +
      productData.Category.slice(1);

    // Create breadcrumb with navigation
    breadcrumbElement.innerHTML = `
      <a href="/product_listing/index.html?category=${productData.Category.toLowerCase()}">${capitalizedCategory}</a>
      > ${productData.NameWithoutBrand}
    `;
  }
}

initialize();
