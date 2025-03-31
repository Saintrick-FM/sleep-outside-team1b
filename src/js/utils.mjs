// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value;
}

/**
 * Render a list using a template function
 * @param {Function} templateFn - Function to generate HTML template for each item
 * @param {HTMLElement} parentElement - Element to insert the list into
 * @param {Array} list - Array of items to render
 * @param {string} position - Position to insert the list (default: 'afterbegin')
 * @param {boolean} clear - Whether to clear the parent element first (default: false)
 */
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  // Reverted paths based on Vite's public directory handling
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header"); // Updated ID
  const footerElement = document.querySelector("#main-footer"); // Updated ID
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  // Set the current year in the footer
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Update cart count in header
  try {
    const cartItems = getLocalStorage("so-cart") || [];
    const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.classList.remove("hide"); // Ensure it's visible
      } else {
        cartCountElement.textContent = ""; // Clear text if empty
        cartCountElement.classList.add("hide"); // Hide if empty
      }
    }
  } catch (error) {
    console.error("Error updating cart count:", error);
    // Optionally hide the count element on error
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.classList.add("hide");
    }
  }
}
