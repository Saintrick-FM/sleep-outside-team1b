// Alert module to fetch and display alerts from alerts.json
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Alert {
  constructor() {
    this.alerts = [];
    this.alertSection = document.createElement("section");
    this.alertSection.classList.add("alert-list");
    this.mainElement = document.querySelector("main");
  }

  async loadAlerts() {
    try {
      // Check local storage first for dismissed alerts
      const dismissedAlerts = getLocalStorage("dismissedAlerts") || [];

      const response = await fetch("/json/alerts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allAlerts = await response.json();

      // Filter out dismissed alerts based on their original index
      this.alerts = allAlerts.filter(
        (_, index) => !dismissedAlerts.includes(index)
      );

      // Store original index with the alert object for dismissal tracking
      this.alerts = this.alerts.map((alert, filteredIndex) => {
          const originalIndex = allAlerts.findIndex(a => a.message === alert.message && a.background === alert.background && a.color === alert.color);
          return { ...alert, originalIndex };
      });


      if (this.alerts.length > 0) {
        this.renderAlerts();
      }
    } catch (error) {
      console.error("Failed to load alerts:", error);
      // Optionally display an error message to the user
    }
  }

  renderAlerts() {
    this.alertSection.innerHTML = ""; // Clear previous alerts if any

    this.alerts.forEach((alert) => { // No need for index here anymore
      const alertElement = document.createElement("p");
      alertElement.textContent = alert.message;
      alertElement.style.backgroundColor = alert.background;
      alertElement.style.color = alert.color;
      alertElement.style.padding = "10px"; // Add some padding
      alertElement.style.margin = "5px 0"; // Add some margin
      alertElement.style.position = "relative"; // For close button positioning

      // Add a close button
      const closeButton = document.createElement("span");
      closeButton.textContent = "X";
      closeButton.style.position = "absolute";
      closeButton.style.right = "10px";
      closeButton.style.top = "50%";
      closeButton.style.transform = "translateY(-50%)";
      closeButton.style.cursor = "pointer";
      closeButton.style.fontWeight = "bold";
      // Use the stored originalIndex for the dataset
      closeButton.dataset.originalIndex = alert.originalIndex;

      closeButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent potential parent clicks
        // Retrieve originalIndex directly from the dataset
        const originalIndexToDismiss = parseInt(event.target.dataset.originalIndex, 10);
        this.dismissAlert(originalIndexToDismiss, alertElement);
      });

      alertElement.appendChild(closeButton);
      this.alertSection.appendChild(alertElement);
    });

    if (this.mainElement) {
      // Prepend the section to the main element
      this.mainElement.prepend(this.alertSection);
    } else {
      console.error("Main element not found in the DOM.");
    }
  }

  dismissAlert(originalIndex, elementToRemove) {
    // Add the original index to local storage
    const dismissedAlerts = getLocalStorage("dismissedAlerts") || [];
    if (!dismissedAlerts.includes(originalIndex)) {
      dismissedAlerts.push(originalIndex);
      setLocalStorage("dismissedAlerts", dismissedAlerts);
    }

    // Remove the element from the DOM
    elementToRemove.remove();

    // Optional: Remove from the current alerts array if needed for other logic
    this.alerts = this.alerts.filter(alert => alert.originalIndex !== originalIndex);


    // If no alerts are left, remove the section
    if (this.alertSection.childElementCount === 0) {
      this.alertSection.remove();
    }
  }
}
