import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ReviewData from "./ReviewData.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    ${product.ListPrice && product.ListPrice > product.FinalPrice
      ? `<p class="product-card__price--original"><del>$${product.ListPrice.toFixed(2)}</del></p>`
      : ""}
    <p class="product-card__price--final">$${product.FinalPrice.toFixed(2)}</p>
    ${product.ListPrice && product.ListPrice > product.FinalPrice
      ? `<p class="product-card__price--savings">You save $${(product.ListPrice - product.FinalPrice).toFixed(2)}</p>`
      : ""}
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
    
    <div class="product-reviews">
      <h3 class="divider">Customer Reviews</h3>
      <div id="reviews-container"></div>
      
      <h4>Add a Review</h4>
      <form id="review-form">
        <div class="form-control">
          <label for="reviewer-name">Your Name:</label>
          <input type="text" id="reviewer-name" required>
        </div>
        
        <div class="form-control">
          <label for="review-rating">Rating:</label>
          <select id="review-rating" required>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        
        <div class="form-control">
          <label for="review-comment">Comment:</label>
          <textarea id="review-comment" rows="4" required></textarea>
        </div>
        
        <button type="submit" id="submit-review">Submit Review</button>
      </form>
    </div>
    </section>`;
}

function reviewTemplate(review) {
  // Generate stars based on rating
  const stars = Array(5)
    .fill("☆")
    .map((star, index) => (index < review.rating ? "★" : "☆"))
    .join("");

  return `
    <div class="review">
      <div class="review-header">
        <span class="review-stars">${stars}</span>
        <span class="review-author">${review.reviewer}</span>
        <span class="review-date">${review.date}</span>
      </div>
      <div class="review-comment">${review.comment}</div>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.reviewDataSource = new ReviewData();
  }
  async init() {
    // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details we can render out the HTML
    this.renderProductDetails("main");
    // once the HTML is rendered we can add a listener to Add to Cart button
    // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));

    // Load and display reviews
    this.loadReviews();

    // Add event listener for review form submission
    document
      .getElementById("review-form")
      .addEventListener("submit", this.submitReview.bind(this));
  }
  addToCart() {
    // Get the current cart or initialize an empty array
    let cartItems = getLocalStorage("so-cart") || [];
    // Ensure cartItems is always an array
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    // Find if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.Id === this.product.Id);

    if (existingItemIndex > -1) {
      // If item exists, increment quantity
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
      // If item doesn't exist, add it with quantity 1
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    // Save the updated cart back to local storage
    setLocalStorage("so-cart", cartItems);

    // Optional: Add visual feedback (e.g., alert, animation)
    alert(`${this.product.NameWithoutBrand} added to cart!`);
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }

  async loadReviews() {
    const reviewsContainer = document.getElementById("reviews-container");
    const reviews = await this.reviewDataSource.findReviewsByProductId(
      this.productId,
    );

    if (reviews.length === 0) {
      reviewsContainer.innerHTML =
        "<p>No reviews yet. Be the first to review this product!</p>";
      return;
    }

    const reviewsHtml = reviews
      .map((review) => reviewTemplate(review))
      .join("");
    reviewsContainer.innerHTML = reviewsHtml;
  }

  async submitReview(event) {
    event.preventDefault();

    const reviewerName = document.getElementById("reviewer-name").value;
    const rating = parseInt(document.getElementById("review-rating").value);
    const comment = document.getElementById("review-comment").value;

    // Create new review object
    const newReview = {
      id: `r${Date.now()}`, // Generate a unique ID based on timestamp
      reviewer: reviewerName,
      date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
      rating: rating,
      comment: comment,
    };

    // Submit the review
    await this.reviewDataSource.addReview(this.productId, newReview);

    // Clear the form
    document.getElementById("reviewer-name").value = "";
    document.getElementById("review-comment").value = "";
    document.getElementById("review-rating").value = "5";

    // In a real application with a backend, we would reload the reviews here
    // For this demo, manually add the review to the display
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML += reviewTemplate(newReview);
  }
}
