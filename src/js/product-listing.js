import ProductData from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
// Set the title with the category name
document.querySelector(".title").textContent = category;

// Initialize the product listing and set breadcrumbs
async function initialize() {
  try {
    // first create an instance of the ProductData class.
    const dataSource = new ProductData();
    // then get the element you want the product list to render in
    const listElement = document.querySelector(".product-list");
    // then create an instance of the ProductList class and send it the correct information.
    const myList = new ProductList(category, dataSource, listElement);
    // finally call the init method to show the products
    // init returns the list of products used.
    const products = await myList.init();

    // Set the breadcrumbs
    const breadcrumbElement = document.querySelector(".breadcrumbs");
    if (breadcrumbElement && category && products) {
      // Capitalize the first letter of the category
      const capitalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      breadcrumbElement.innerHTML = `
        <a href="/index.html">Home</a> > 
        ${capitalizedCategory} 
        <span class="item-count">(${products.length} items)</span>
      `;
    }

    return products;
  } catch (error) {
    // Log error to error monitoring service (if available)
    const listElement = document.querySelector(".product-list");
    if (listElement) {
      listElement.innerHTML = "<p class=\"error\">Error loading products. Please try again later.</p>";
    }
  }
}

// Call the initialize function
initialize();
