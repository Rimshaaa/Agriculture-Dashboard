export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapseBtn");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (!sidebar) return;

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-hidden");
    });
  }
}
