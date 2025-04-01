import Alert from "./Alert.js"; // Import the Alert class
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Instantiate Alert and load alerts
const alert = new Alert();
alert.loadAlerts();
