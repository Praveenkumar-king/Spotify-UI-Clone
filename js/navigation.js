/* navigation.js - Spotify UI Sidebar and main view routing helper */

document.addEventListener("DOMContentLoaded", () => {
  setupHistoryControls();
  highlightActiveSidebar();
});

// Configure Back/Forward Top navigation arrows
function setupHistoryControls() {
  const backBtn = document.getElementById("nav-back");
  const forwardBtn = document.getElementById("nav-forward");
  
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }
  
  if (forwardBtn) {
    forwardBtn.addEventListener("click", () => {
      window.history.forward();
    });
  }
}

// Highlight the current page active sidebar item
function highlightActiveSidebar() {
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  const navItems = document.querySelectorAll(".sidebar-nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  
  navItems.forEach(item => {
    item.classList.remove("active");
    const link = item.querySelector("a");
    if (link) {
      const href = link.getAttribute("href");
      if (href === fileName || (fileName === "" && href === "index.html")) {
        item.classList.add("active");
      }
    }
  });
  
  mobileNavItems.forEach(item => {
    item.classList.remove("active");
    const href = item.getAttribute("href");
    if (href === fileName || (fileName === "" && href === "index.html")) {
      item.classList.add("active");
    }
  });
}
