import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images.ExtraSmall}" 
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="cart-card__remove" data-id="${item.Id}">X</button>
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
    this.addRemoveListeners();
  }

  addRemoveListeners() {
    this.listElement.addEventListener("click", (event) => {
      if (event.target.matches(".cart-card__remove")) {
        const itemId = event.target.dataset.id;
        this.removeItem(itemId);
      }
    });
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.Id !== id);
    setLocalStorage("so-cart", this.items);
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

    // Calculate and display total considering quantity
    const total = this.items.reduce((sum, item) => sum + (item.FinalPrice * item.quantity), 0);
    document.querySelector(".cart-total").textContent =
      `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  }
}
