/* search.js - Spotify UI Search dynamic browsing logic */

const SEARCH_CATEGORIES = [
  { name: "Podcasts", color: "#27856a", img: "assets/playlists/top_hits.jpg" },
  { name: "Made For You", color: "#1e3264", img: "assets/playlists/lofi_beats.jpg" },
  { name: "New Releases", color: "#e8115b", img: "assets/albums/after_hours.jpg" },
  { name: "Pop", color: "#148a08", img: "assets/albums/midnights.jpg" },
  { name: "Hip-Hop", color: "#bc5900", img: "assets/playlists/rap_caviar.jpg" },
  { name: "Latin", color: "#e11900", img: "assets/playlists/viva_latino.jpg" },
  { name: "Rock", color: "#e91429", img: "assets/playlists/rock_classics.jpg" },
  { name: "Lofi Focus", color: "#7d4b32", img: "assets/playlists/peaceful_piano.jpg" }
];

document.addEventListener("DOMContentLoaded", () => {
  renderSearchCategories();
  setupSearchInput();
});

// Render Spotify Browse categories
function renderSearchCategories() {
  const container = document.getElementById("search-categories-grid");
  if (!container) return;
  
  container.innerHTML = SEARCH_CATEGORIES.map(cat => `
    <div class="category-card" style="background-color: ${cat.color}; overflow:hidden; position:relative; border-radius:8px; aspect-ratio: 1; cursor:pointer; padding:16px; transition:transform 0.2s;" onclick="showToast('Browsing ${cat.name} category.')">
      <h3 style="font-size:20px; font-weight:800; word-wrap:break-word; max-width:70%; line-height:1.2;">${cat.name}</h3>
      <img src="${cat.img}" style="width:72px; height:72px; transform: rotate(25deg) translate(18%, 10%); position:absolute; bottom:0; right:0; box-shadow:0 4px 8px rgba(0,0,0,0.3); border-radius:4px;" alt="">
    </div>
  `).join('');
  
  // Add scale animation on hover
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("mouseenter", () => card.style.transform = "scale(1.03)");
    card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");
  });
}

// Live search input filtering
function setupSearchInput() {
  const input = document.getElementById("search-input-field");
  const categoriesSection = document.getElementById("search-categories-section");
  const resultsSection = document.getElementById("search-results-section");
  const resultsContainer = document.getElementById("search-results-list");
  
  if (!input) return;
  
  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === "") {
      categoriesSection.style.display = "block";
      resultsSection.style.display = "none";
      return;
    }
    
    // Filter matching tracks from DB
    const matchingTracks = SPOTIFY_DB.tracks.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.artist.toLowerCase().includes(query) || 
      t.album.toLowerCase().includes(query)
    );
    
    categoriesSection.style.display = "none";
    resultsSection.style.display = "block";
    
    if (matchingTracks.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding:48px; text-align:center; color:var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size:32px; margin-bottom:12px;"></i>
          <p>No results found for "${e.target.value}"</p>
        </div>
      `;
      return;
    }
    
    // Render Results table row list
    resultsContainer.innerHTML = `
      <div class="tracklist-container" style="margin-top:0;">
        <div class="track-row header-row">
          <div class="track-index">#</div>
          <div>Title</div>
          <div class="track-album">Album</div>
          <div></div>
          <div class="track-duration"><i class="fa-regular fa-clock"></i></div>
        </div>
        ${matchingTracks.map((t, index) => {
          const isLiked = localStorage.getItem(`liked_track_${t.id}`) === "true";
          return `
            <div class="track-row ${t.id === SPOTIFY_DB.tracks[currentTrackIndex].id && isPlaying ? 'playing' : ''}" data-track-id="${t.id}" onclick="playTrack(${t.id})">
              <div class="track-index">
                <span class="track-num-span">${index + 1}</span>
                <i class="fa-solid fa-play"></i>
              </div>
              <div class="track-main">
                <img src="${t.art}" class="track-art" alt="">
                <div class="track-meta">
                  <span class="track-title">${t.title}</span>
                  <span class="track-artist">${t.artist}</span>
                </div>
              </div>
              <div class="track-album" onclick="event.stopPropagation(); viewAlbum('${t.album}')">${t.album}</div>
              <div>
                <button class="track-fav ${isLiked ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleLikeTrack(this, ${t.id})">
                  <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
              </div>
              <div class="track-duration">${formatSearchDuration(t.duration)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  });
}

// Favorite toggle inside search list
window.toggleLikeTrack = function(btn, id) {
  const itemKey = `liked_track_${id}`;
  const isCurrentlyLiked = localStorage.getItem(itemKey) === "true";
  
  localStorage.setItem(itemKey, !isCurrentlyLiked);
  
  if (!isCurrentlyLiked) {
    btn.classList.add("favorited");
    btn.querySelector("i").className = "fa-solid fa-heart";
    showToast("Added to Liked Songs");
  } else {
    btn.classList.remove("favorited");
    btn.querySelector("i").className = "fa-regular fa-heart";
    showToast("Removed from Liked Songs");
  }
  
  // Re-sync player bar UI if the currently playing song is the one liked
  if (id === SPOTIFY_DB.tracks[currentTrackIndex].id) {
    const playerLike = document.getElementById("player-like");
    if (playerLike) {
      playerLike.classList.toggle("liked", !isCurrentlyLiked);
      playerLike.querySelector("i").className = !isCurrentlyLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }
  }
}

function formatSearchDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
