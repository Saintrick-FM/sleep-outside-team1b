import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.items = [];
  }

  async init() {
    this.items = getLocalStorage("so-cart") || [];
    this.renderItems();
  }

  renderItems() {
    const cartFooter = document.querySelector(".cart-footer");

    // Render the list if we have items
    if (this.items.length === 0) {
      this.listElement.innerHTML = "<p>No items in cart</p>";
      cartFooter.classList.add("hide");
      return;
    }

    const htmlItems = this.items.map((item) => cartItemTemplate(item));
    this.listElement.innerHTML = htmlItems.join("");

    // Calculate and display total
    const total = this.items.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector(".cart-total").textContent =
      `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  }
}
