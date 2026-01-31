import { user } from "./data.js";
import { initSidebar } from "./sidebar.js";
import { initDashboard } from "./dashboard.js";
import { initCrops } from "./crops.js";
import { initFarmers } from "./farmers.js";
import { initReports } from "./reports.js";
import { initSettings } from "./settings.js";

function setUserProfile() {
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  if (userName) userName.textContent = user.name;
  if (userRole) userRole.textContent = user.role;
  if (userAvatar) userAvatar.src = user.avatar;
}

function initTopbarButtons() {
  const logoutBtn = document.getElementById("logoutBtn");
  const notifyBtn = document.getElementById("notifyBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Logged out (demo).");
      window.location.href = "../pages/dashboard.html";
    });
  }

  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      alert("No new notifications.");
    });
  }
}

function runPageModules() {
  initSidebar();
  setUserProfile();
  initTopbarButtons();

  // Run page based init based on DOM element existence:
  initDashboard();
  initCrops();
  initFarmers();
  initReports();
  initSettings();
}

document.addEventListener("DOMContentLoaded", runPageModules);
