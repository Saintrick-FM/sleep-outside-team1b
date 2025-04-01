import { renderListWithTemplate } from "./utils.mjs";

/**
 * Generates the HTML template for a product card
 * @param {Object} product - The product object
 * @returns {String} The HTML template for the product card
 */

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
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
    const list = await this.dataSource.getData(this.category);
    this.products = list;
    // Render the list once we have the data
    this.renderList();
    // Return the products array
    return this.products;
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

  renderProductList(list) {
    return list
      .map(
        (product) => `<li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}"/>
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </li>`,
      )
      .join("");
  }
}
