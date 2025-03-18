import { renderListWithTemplate } from "./utils.mjs";

/**
 * Generates the HTML template for a product card
 * @param {Object} product - The product object
 * @returns {String} The HTML template for the product card
 */

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img
        src="images/tents/${product.Images.PrimaryMedium}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.ListPrice}</p>
    </a>
  </li>`;
}

/**
 * ProductList class to generate HTML list of product cards from an array
 */
export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Initialize the instance properties
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  /**
   * Initialize the product list by getting the data from the dataSource
   * Using async/await to handle the promise from getData()
   */
  async init() {
    // Get the product data
    this.products = await this.dataSource.getData();
    // Render the list once we have the data
    this.renderList();
  }

  /**
   * Render the list of products - to be implemented
   */
  renderList() {
    if (!this.products || this.products.length === 0) {
      const message = "No products available in this category.";
      this.listElement.innerHTML = `<p class="notice">${message}</p>`;
      return;
    }

    // Use the renderListWithTemplate utility to render the products
    this.listElement.innerHTML = "<ul class='product-list'></ul>";
    const productList = this.listElement.querySelector(".product-list");
    renderListWithTemplate(
      productCardTemplate,
      productList,
      this.products,
      "afterbegin",
      false,
    );
  }
}
