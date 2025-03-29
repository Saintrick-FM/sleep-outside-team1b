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
    // Render the list if we have items
    if (this.items.length === 0) {
      this.listElement.innerHTML = "<p>No items in cart</p>";
      return;
    }

    const htmlItems = this.items.map((item) => cartItemTemplate(item));
    this.listElement.innerHTML = htmlItems.join("");
  }
}
