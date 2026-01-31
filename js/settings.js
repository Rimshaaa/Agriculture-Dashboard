const defaultCollapsed = localStorage.getItem("agri_sidebar_default") === "true";
if (defaultCollapsed) sidebar.classList.add("collapsed");
export function initSettings() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const sidebarDefaultToggle = document.getElementById("sidebarDefaultToggle");
  const notificationToggle = document.getElementById("notificationToggle");

  const profileForm = document.getElementById("profileForm");
  if (!darkModeToggle && !profileForm) return; // not on settings page

  // -----------------------------
  // LocalStorage Keys
  // -----------------------------
  const keys = {
    darkMode: "agri_dark_mode",
    sidebarCollapsed: "agri_sidebar_default",
    notifications: "agri_notifications",
    profile: "agri_profile_data",
  };

  // -----------------------------
  // Apply Theme
  // -----------------------------
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.style.setProperty("--bg", "#0b1220");
      document.documentElement.style.setProperty("--card", "#0f1a30");
      document.documentElement.style.setProperty("--text", "#e5e7eb");
      document.documentElement.style.setProperty("--muted", "rgba(229,231,235,0.65)");
      document.documentElement.style.setProperty("--border", "rgba(255,255,255,0.08)");
    } else {
      document.documentElement.style.setProperty("--bg", "#f4f6fb");
      document.documentElement.style.setProperty("--card", "#ffffff");
      document.documentElement.style.setProperty("--text", "#1f2937");
      document.documentElement.style.setProperty("--muted", "#6b7280");
      document.documentElement.style.setProperty("--border", "#e5e7eb");
    }
  }

  // -----------------------------
  // Load Stored Settings
  // -----------------------------
  const storedDark = localStorage.getItem(keys.darkMode) === "true";
  const storedSidebarCollapsed = localStorage.getItem(keys.sidebarCollapsed) === "true";
  const storedNotifications = localStorage.getItem(keys.notifications) === "true";

  if (darkModeToggle) darkModeToggle.checked = storedDark;
  if (sidebarDefaultToggle) sidebarDefaultToggle.checked = storedSidebarCollapsed;
  if (notificationToggle) notificationToggle.checked = storedNotifications;

  applyTheme(storedDark);

  // -----------------------------
  // Toggle Events
  // -----------------------------
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      localStorage.setItem(keys.darkMode, darkModeToggle.checked);
      applyTheme(darkModeToggle.checked);
    });
  }

  if (sidebarDefaultToggle) {
    sidebarDefaultToggle.addEventListener("change", () => {
      localStorage.setItem(keys.sidebarCollapsed, sidebarDefaultToggle.checked);
      alert("Saved! Refresh page to see sidebar default state.");
    });
  }

  if (notificationToggle) {
    notificationToggle.addEventListener("change", () => {
      localStorage.setItem(keys.notifications, notificationToggle.checked);
      alert(notificationToggle.checked ? "Notifications Enabled ✅" : "Notifications Disabled ❌");
    });
  }

  // -----------------------------
  // Profile Form Validation + Save
  // -----------------------------
  const nameInput = document.getElementById("profileName");
  const roleInput = document.getElementById("profileRole");
  const phoneInput = document.getElementById("profilePhone");

  const errName = document.getElementById("errProfileName");
  const errRole = document.getElementById("errProfileRole");
  const errPhone = document.getElementById("errProfilePhone");

  function clearErrors() {
    if (errName) errName.textContent = "";
    if (errRole) errRole.textContent = "";
    if (errPhone) errPhone.textContent = "";
  }

  function validatePhone(phone) {
    // simple validation: 11 digits OR 03xx-xxxxxxx
    const clean = phone.replace(/[^0-9]/g, "");
    return clean.length === 11;
  }

  function validateProfile() {
    clearErrors();
    let ok = true;

    const nameVal = nameInput.value.trim();
    const roleVal = roleInput.value.trim();
    const phoneVal = phoneInput.value.trim();

    if (!nameVal || nameVal.length < 3) {
      errName.textContent = "Name must be at least 3 characters.";
      ok = false;
    }
    if (!roleVal || roleVal.length < 2) {
      errRole.textContent = "Role is required.";
      ok = false;
    }
    if (!phoneVal || !validatePhone(phoneVal)) {
      errPhone.textContent = "Enter valid phone (11 digits).";
      ok = false;
    }

    return ok;
  }

  // Load stored profile (optional demo)
  const storedProfile = localStorage.getItem(keys.profile);
  if (storedProfile) {
    try {
      const p = JSON.parse(storedProfile);
      if (nameInput) nameInput.value = p.name || "";
      if (roleInput) roleInput.value = p.role || "";
      if (phoneInput) phoneInput.value = p.phone || "";
    } catch (err) {}
  }

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validateProfile()) return;

      const payload = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        phone: phoneInput.value.trim(),
      };

      localStorage.setItem(keys.profile, JSON.stringify(payload));
      alert("Profile saved successfully ✅");
    });
  }
}
