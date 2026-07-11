/* app.js - Global Shared State and Utility Functions */

// Shared Database for the Spotify Clone
const SPOTIFY_DB = {
  tracks: [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: 200,
      art: "assets/albums/after_hours.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      plays: "2,492,028,124"
    },
    {
      id: 2,
      title: "Lunch",
      artist: "Billie Eilish",
      album: "Hit Me Hard and Soft",
      duration: 180,
      art: "assets/albums/hit_me_hard.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      plays: "482,903,129"
    },
    {
      id: 3,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      album: "Midnights",
      duration: 201,
      art: "assets/albums/midnights.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      plays: "1,294,002,940"
    },
    {
      id: 4,
      title: "God's Plan",
      artist: "Drake",
      album: "Certified Lover Boy",
      duration: 198,
      art: "assets/albums/certified_lover.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      plays: "2,109,240,119"
    },
    {
      id: 5,
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "Divide",
      duration: 233,
      art: "assets/albums/divide.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      plays: "3,594,204,912"
    },
    {
      id: 6,
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      duration: 215,
      art: "assets/albums/after_hours.jpg",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      plays: "1,893,004,124"
    }
  ],
  playlists: [
    {
      id: 1,
      name: "Today's Top Hits",
      desc: "Billie Eilish is on top of the Hottest 50!",
      art: "assets/playlists/top_hits.jpg",
      followers: "34,291,093",
      tracks: [1, 2, 3, 5]
    },
    {
      id: 2,
      name: "RapCaviar",
      desc: "New music from Drake, Travis Scott, and Gunna.",
      art: "assets/playlists/rap_caviar.jpg",
      followers: "15,204,902",
      tracks: [4, 1, 6]
    },
    {
      id: 3,
      name: "Viva Latino",
      desc: "Today's top Latin hits, featuring Bad Bunny and Karol G.",
      art: "assets/playlists/viva_latino.jpg",
      followers: "12,903,114",
      tracks: [2, 3, 4]
    },
    {
      id: 4,
      name: "Peaceful Piano",
      desc: "Relaxing piano masterpieces to help you focus.",
      art: "assets/playlists/peaceful_piano.jpg",
      followers: "8,924,930",
      tracks: [5, 2]
    },
    {
      id: 5,
      name: "Rock Classics",
      desc: "Rock legends & epic solos that defined generations.",
      art: "assets/playlists/rock_classics.jpg",
      followers: "11,209,304",
      tracks: [1, 3, 5]
    },
    {
      id: 6,
      name: "Chill Lofi Study Beats",
      desc: "Lofi beats to study, relax or work to.",
      art: "assets/playlists/lofi_beats.jpg",
      followers: "6,924,118",
      tracks: [6, 5, 2]
    }
  ],
  artists: [
    {
      id: 1,
      name: "The Weeknd",
      headline: "Canadian Singer-Songwriter",
      avatar: "assets/artists/the_weeknd.jpg",
      listeners: "114,249,028",
      popularTracks: [1, 6]
    },
    {
      id: 2,
      name: "Billie Eilish",
      headline: "American Singer-Songwriter",
      avatar: "assets/artists/billie_eilish.jpg",
      listeners: "98,204,912",
      popularTracks: [2, 3]
    },
    {
      id: 3,
      name: "Taylor Swift",
      headline: "Global Pop Sensation",
      avatar: "assets/artists/taylor_swift.jpg",
      listeners: "102,940,240",
      popularTracks: [3, 2, 5]
    },
    {
      id: 4,
      name: "Drake",
      headline: "American Rap Icon",
      avatar: "assets/artists/drake.jpg",
      listeners: "84,930,124",
      popularTracks: [4, 1]
    },
    {
      id: 5,
      name: "Ed Sheeran",
      headline: "English Singer-Songwriter",
      avatar: "assets/artists/ed_sheeran.jpg",
      listeners: "79,249,031",
      popularTracks: [5, 1, 6]
    }
  ]
};

// Global State
let currentTrackIndex = 0;
let isPlaying = false;
let playQueue = [...SPOTIFY_DB.tracks];
let isShuffle = false;
let isRepeat = false;
let audioPlayer = new Audio();

/* ==========================================
   AUTHENTICATION SYSTEM (Login, Sign-up, localStorage)
   ========================================== */

// Initialize default users if not present
if (!localStorage.getItem("spotify_registered_users")) {
  const defaultUsers = [
    { username: "praveen", password: "password" },
    { username: "admin", password: "admin" }
  ];
  localStorage.setItem("spotify_registered_users", JSON.stringify(defaultUsers));
}

// Inject CSS styles for Auth Modal and UI states dynamically
function injectAuthStyles() {
  if (document.getElementById("auth-styles")) return;
  const style = document.createElement("style");
  style.id = "auth-styles";
  style.textContent = `
    .auth-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .auth-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .auth-modal-card {
      background-color: #121212;
      border-radius: 12px;
      width: 440px;
      max-width: 90%;
      padding: 48px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.8);
      border: 1px solid rgba(255,255,255,0.06);
      text-align: center;
      position: relative;
      transform: scale(0.95) translateY(10px);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .auth-modal-overlay.active .auth-modal-card {
      transform: scale(1) translateY(0);
    }
    .auth-close-btn {
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 24px;
      color: #a7a7a7;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s, transform 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .auth-close-btn:hover {
      color: #ffffff;
      background-color: rgba(255,255,255,0.1);
      transform: scale(1.05);
    }
    .auth-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 16px;
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .auth-title {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 24px;
      letter-spacing: -0.5px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      text-align: left;
    }
    .auth-field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .auth-label {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }
    .auth-input {
      width: 100%;
      height: 48px;
      background-color: #242424;
      border: 1px solid #727272;
      border-radius: 4px;
      padding: 0 16px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .auth-input:focus {
      border-color: #ffffff;
      background-color: #2a2a2a;
    }
    .auth-input::placeholder {
      color: #727272;
    }
    .auth-input.error {
      border-color: #e91429;
    }
    .auth-error-container {
      background-color: #e91429;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      display: none;
      align-items: center;
      gap: 8px;
      text-align: left;
    }
    .auth-submit-btn {
      background-color: #1db954;
      color: #000000;
      height: 48px;
      border: none;
      border-radius: 500px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.2s;
      margin-top: 10px;
      font-family: var(--font-family);
    }
    .auth-submit-btn:hover {
      background-color: #1ed760;
      transform: scale(1.04);
    }
    .auth-switch-text {
      margin-top: 24px;
      font-size: 14px;
      color: #a7a7a7;
      font-weight: 500;
    }
    .auth-switch-link {
      color: #ffffff;
      text-decoration: underline;
      cursor: pointer;
      font-weight: 700;
      transition: color 0.2s;
    }
    .auth-switch-link:hover {
      color: #1db954;
    }

    .me-dropdown.open {
      display: flex !important;
    }
    .user-menu {
      position: relative !important;
    }
  `;
  document.head.appendChild(style);
}

// Inject Modal HTML into the DOM
function injectAuthModal() {
  if (document.getElementById("auth-modal")) return;
  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.className = "auth-modal-overlay";
  modal.innerHTML = `
    <div class="auth-modal-card">
      <button class="auth-close-btn" onclick="closeAuthModal()"><i class="fa-solid fa-xmark"></i></button>
      
      <div class="auth-logo">
        <i class="fa-brands fa-spotify" style="color: #1db954; font-size: 40px;"></i>
        <span>Spotify</span>
      </div>
      
      <h2 class="auth-title" id="auth-modal-title">Log in to Spotify</h2>
      
      <div class="auth-error-container" id="auth-error-box">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span id="auth-error-msg">Incorrect username or password.</span>
      </div>
      
      <form class="auth-form" id="auth-modal-form" onsubmit="handleAuthSubmit(event)">
        <div class="auth-field-group">
          <label class="auth-label" for="auth-username">Username</label>
          <input type="text" id="auth-username" class="auth-input" placeholder="Username" required autocomplete="username">
        </div>
        
        <div class="auth-field-group">
          <label class="auth-label" for="auth-password">Password</label>
          <input type="password" id="auth-password" class="auth-input" placeholder="Password" required autocomplete="current-password">
        </div>
        
        <button type="submit" class="auth-submit-btn" id="auth-submit-button">Log In</button>
      </form>
      
      <div class="auth-switch-text" id="auth-switch-wrapper">
        Don't have an account? <span class="auth-switch-link" onclick="toggleAuthMode('signup')">Sign up for Spotify</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Global modal controls
window.showLoginModal = function(mode = "login") {
  injectAuthStyles();
  injectAuthModal();
  
  const modal = document.getElementById("auth-modal");
  if (modal) {
    toggleAuthMode(mode);
    modal.classList.add("active");
    // Focus the username field
    setTimeout(() => {
      document.getElementById("auth-username").focus();
    }, 100);
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("active");
    // Clear inputs and errors
    document.getElementById("auth-username").value = "";
    document.getElementById("auth-password").value = "";
    document.getElementById("auth-error-box").style.display = "none";
    document.getElementById("auth-username").classList.remove("error");
    document.getElementById("auth-password").classList.remove("error");
  }
};

// Toggle between Login and Signup modes
window.toggleAuthMode = function(mode) {
  const title = document.getElementById("auth-modal-title");
  const submitBtn = document.getElementById("auth-submit-button");
  const switchWrapper = document.getElementById("auth-switch-wrapper");
  const errorBox = document.getElementById("auth-error-box");
  
  errorBox.style.display = "none";
  document.getElementById("auth-username").classList.remove("error");
  document.getElementById("auth-password").classList.remove("error");
  
  if (mode === "signup") {
    title.textContent = "Sign up for Spotify";
    submitBtn.textContent = "Sign Up";
    switchWrapper.innerHTML = `Already have an account? <span class="auth-switch-link" onclick="toggleAuthMode('login')">Log in here</span>`;
    document.getElementById("auth-modal-form").dataset.mode = "signup";
  } else {
    title.textContent = "Log in to Spotify";
    submitBtn.textContent = "Log In";
    switchWrapper.innerHTML = `Don't have an account? <span class="auth-switch-link" onclick="toggleAuthMode('signup')">Sign up for Spotify</span>`;
    document.getElementById("auth-modal-form").dataset.mode = "login";
  }
};

// Handle Form Submission
window.handleAuthSubmit = function(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("auth-username");
  const passwordInput = document.getElementById("auth-password");
  const errorBox = document.getElementById("auth-error-box");
  const errorMsg = document.getElementById("auth-error-msg");
  
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const mode = document.getElementById("auth-modal-form").dataset.mode;
  
  if (!username || !password) return;
  
  let registeredUsers = JSON.parse(localStorage.getItem("spotify_registered_users")) || [];
  
  if (mode === "signup") {
    // Check if user already exists
    const userExists = registeredUsers.some(u => u.username === username);
    if (userExists) {
      errorMsg.textContent = "Username is already taken.";
      errorBox.style.display = "flex";
      usernameInput.classList.add("error");
      return;
    }
    
    // Register new user
    registeredUsers.push({ username, password });
    localStorage.setItem("spotify_registered_users", JSON.stringify(registeredUsers));
    
    // Log in automatically
    localStorage.setItem("spotify_logged_in", "true");
    localStorage.setItem("spotify_username", username);
    
    closeAuthModal();
    applyLoginState();
    showToast(`Welcome to Spotify, ${username}!`);
  } else {
    // Log in verification
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem("spotify_logged_in", "true");
      localStorage.setItem("spotify_username", user.username);
      
      closeAuthModal();
      applyLoginState();
      showToast(`Welcome back, ${user.username}!`);
    } else {
      errorMsg.textContent = "Incorrect username or password.";
      errorBox.style.display = "flex";
      usernameInput.classList.add("error");
      passwordInput.classList.add("error");
    }
  }
};

// Remove error styling on input focus
document.addEventListener("focusin", (e) => {
  if (e.target.classList.contains("auth-input")) {
    e.target.classList.remove("error");
  }
});

// Update UI display according to login state
function applyLoginState() {
  const isLoggedIn = localStorage.getItem("spotify_logged_in") === "true";
  const currentUsername = localStorage.getItem("spotify_username") || "Praveen Kumar";
  const displayName = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
  
  // Update all instances of user-name text
  document.querySelectorAll(".user-name").forEach(el => {
    el.textContent = displayName;
  });

  // Sync avatar image across the header
  const userAvatarUrl = localStorage.getItem("spotify_user_avatar") || "assets/artists/taylor_swift.jpg";
  document.querySelectorAll(".user-avatar, #header-avatar").forEach(img => {
    img.src = userAvatarUrl;
  });

  const userMenu = document.getElementById("user-menu-trigger");
  if (userMenu) {
    const parent = userMenu.parentElement;
    
    // Find explore premium badge (if any)
    const premiumBadge = parent.querySelector(".badge-dark") || parent.querySelector(".badge");
    let authButtons = document.getElementById("auth-buttons-container");
    
    if (isLoggedIn) {
      // Show user menu
      userMenu.style.display = "flex";
      
      // Dynamic Explore Premium badge logic based on user subscription
      const isPremium = localStorage.getItem("spotify_premium_plan") === "true";
      if (premiumBadge && premiumBadge.textContent.includes("Premium")) {
        premiumBadge.style.display = isPremium ? "none" : "inline-block";
      } else if (premiumBadge) {
        premiumBadge.style.display = "inline-block";
      }
      
      // Remove auth buttons if they exist
      if (authButtons) authButtons.remove();
      
      // Show player controls
      const playerBar = document.querySelector(".player-bar");
      if (playerBar) playerBar.style.display = "flex";
      
      // Remove logged-out banner
      const banner = document.getElementById("logged-out-banner");
      if (banner) banner.remove();
    } else {
      // Hide user menu
      userMenu.style.display = "none";
      if (premiumBadge && !premiumBadge.classList.contains("nav-signup-btn") && !premiumBadge.classList.contains("nav-login-btn")) {
        premiumBadge.style.display = "none";
      }
      
      // Create and append auth buttons
      if (!authButtons) {
        authButtons = document.createElement("div");
        authButtons.id = "auth-buttons-container";
        authButtons.style.cssText = "display: flex; align-items: center; gap: 16px;";
        authButtons.innerHTML = `
          <button class="nav-signup-btn" style="background: transparent; border: none; color: #a7a7a7; font-weight: 700; font-size: 16px; cursor: pointer; transition: transform 0.2s, color 0.2s; padding: 8px 16px;" onmouseover="this.style.color='#fff'; this.style.transform='scale(1.04)'" onmouseout="this.style.color='#a7a7a7'; this.style.transform='scale(1)'">Sign up</button>
          <button class="nav-login-btn" id="header-login-btn" style="background-color: #ffffff; color: #000000; border: none; border-radius: 500px; padding: 12px 32px; font-weight: 700; font-size: 16px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">Log in</button>
        `;
        parent.appendChild(authButtons);
        
        authButtons.querySelector(".nav-signup-btn").addEventListener("click", () => window.showLoginModal("signup"));
        authButtons.querySelector(".nav-login-btn").addEventListener("click", () => window.showLoginModal("login"));
      }
      
      // Hide player controls
      const playerBar = document.querySelector(".player-bar");
      if (playerBar) playerBar.style.display = "none";
      
      // Add logged-out bottom banner
      let banner = document.getElementById("logged-out-banner");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "logged-out-banner";
        banner.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100%; height: var(--player-height, 90px); background: linear-gradient(90deg, #af2896 0%, #509bf5 100%); display: flex; justify-content: space-between; align-items: center; padding: 0 32px; z-index: 1000; box-shadow: 0 -4px 12px rgba(0,0,0,0.3); color: #ffffff;";
        banner.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 4px; text-align: left; cursor: default;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.9); font-family: var(--font-family);">Preview of Spotify</span>
            <span style="font-size: 14px; font-weight: 600; font-family: var(--font-family);">Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</span>
          </div>
          <button id="banner-signup-btn" style="background-color: #ffffff; color: #000000; border: none; border-radius: 500px; padding: 14px 32px; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform 0.2s; white-space: nowrap; font-family: var(--font-family);" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">Sign up free</button>
        `;
        document.body.appendChild(banner);
        banner.querySelector("#banner-signup-btn").addEventListener("click", () => window.showLoginModal("signup"));
      }
    }
  }
}

// Initialize user details
document.addEventListener("DOMContentLoaded", () => {
  // Setup navigation guards
  const isLoggedIn = localStorage.getItem("spotify_logged_in") === "true";
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  if (!isLoggedIn && (fileName === "library.html" || fileName === "profile.html" || fileName === "settings.html")) {
    window.location.href = "index.html?triggerLogin=true";
    return;
  }

  // Inject styles & modal elements
  injectAuthStyles();
  injectAuthModal();
  applyLoginState();

  // If redirected for login, trigger the modal
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("triggerLogin") === "true" && !isLoggedIn) {
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => {
      window.showLoginModal("login");
    }, 300);
  }

  // Setup user menu dropdown
  const userMenu = document.getElementById("user-menu-trigger");
  const userDropdown = document.getElementById("user-dropdown-menu");
  
  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("open");
    });
    
    document.addEventListener("click", () => {
      userDropdown.classList.remove("open");
    });

    // Dynamically update dropdown links to point to actual pages
    userDropdown.querySelectorAll("a").forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes("profile")) {
        link.setAttribute("href", "profile.html");
        link.removeAttribute("onclick");
      } else if (text.includes("settings")) {
        link.setAttribute("href", "settings.html");
        link.removeAttribute("onclick");
      }
    });
  }

  // Bind Log out dropdown click
  document.querySelectorAll("#user-dropdown-menu a").forEach(link => {
    if (link.textContent.toLowerCase().includes("log out")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem("spotify_logged_in");
        localStorage.removeItem("spotify_username");
        showToast("Logged out successfully!");
        applyLoginState();
        setTimeout(() => {
          if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) !== "index.html") {
            window.location.href = "index.html";
          }
        }, 1000);
      });
    }
  });
  
  // Render Library Sidebar playlists
  const libraryScroll = document.getElementById("library-playlists");
  if (libraryScroll) {
    libraryScroll.innerHTML = SPOTIFY_DB.playlists.map(pl => `
      <div class="library-item" onclick="viewPlaylist(${pl.id})">
        <img src="${pl.art}" class="library-item-img" alt="">
        <div class="library-item-details">
          <span class="library-item-title">${pl.name}</span>
          <span class="library-item-meta">Playlist &bull; ${pl.followers} followers</span>
        </div>
      </div>
    `).join('');
  }
});

// Toast notification helper
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = "position:fixed; bottom:110px; left:50%; transform:translateX(-50%); background-color:#1db954; color:#000000; font-weight:700; padding:12px 24px; border-radius:24px; z-index:10000; font-size:14px; box-shadow:0 8px 16px rgba(0,0,0,0.4); display:flex; gap:8px; align-items:center; opacity:0; transition:opacity 0.2s, transform 0.2s;";
    document.body.appendChild(container);
  }
  
  container.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  container.style.opacity = "1";
  container.style.transform = "translateX(-50%) translateY(-10px)";
  
  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transform = "translateX(-50%) translateY(0px)";
  }, 2500);
}

// Navigation helpers
window.viewPlaylist = function(id) {
  window.location.href = `playlist.html?id=${id}`;
}

window.viewArtist = function(id) {
  window.location.href = `artist.html?id=${id}`;
}

window.viewAlbum = function(albumName) {
  // Find track from database to retrieve album cover
  const track = SPOTIFY_DB.tracks.find(t => t.album.toLowerCase() === albumName.toLowerCase());
  if (track) {
    window.location.href = `album.html?name=${encodeURIComponent(albumName)}`;
  }
}
