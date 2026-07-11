/* playlist.js - Spotify UI Playlist and Album track rows dynamic builder */

document.addEventListener("DOMContentLoaded", () => {
  window.loadPlaylistView = function() {
    const params = new URLSearchParams(window.location.search);
    const playlistId = parseInt(params.get("id"));
    const albumName = params.get("name");
    
    const bannerContainer = document.getElementById("playlist-banner-section");
    const listContainer = document.getElementById("playlist-tracklist-section");
    
    if (!bannerContainer || !listContainer) return;
    
    let title = "";
    let desc = "";
    let art = "";
    let stats = "";
    let tracks = [];
    let bannerGradient = "linear-gradient(to bottom, #404040, #121212)";
    
    if (playlistId) {
      // Find Playlist in database
      const playlist = SPOTIFY_DB.playlists.find(p => p.id === playlistId);
      if (playlist) {
        title = playlist.name;
        desc = playlist.desc;
        art = playlist.art;
        stats = `Spotify &bull; ${playlist.followers} likes &bull; ${playlist.tracks.length} songs`;
        tracks = playlist.tracks.map(tid => SPOTIFY_DB.tracks.find(t => t.id === tid));
        
        // Custom gradients based on playlist
        const gradients = [
          "linear-gradient(to bottom, rgb(83, 83, 83) 0%, var(--spotify-dark) 100%)",
          "linear-gradient(to bottom, rgb(28, 64, 94) 0%, var(--spotify-dark) 100%)",
          "linear-gradient(to bottom, rgb(160, 48, 48) 0%, var(--spotify-dark) 100%)",
          "linear-gradient(to bottom, rgb(56, 120, 80) 0%, var(--spotify-dark) 100%)",
          "linear-gradient(to bottom, rgb(112, 88, 56) 0%, var(--spotify-dark) 100%)",
          "linear-gradient(to bottom, rgb(80, 56, 112) 0%, var(--spotify-dark) 100%)"
        ];
        bannerGradient = gradients[(playlist.id - 1) % gradients.length];
      }
    } else if (albumName) {
      // Find tracks inside this Album
      tracks = SPOTIFY_DB.tracks.filter(t => t.album.toLowerCase() === albumName.toLowerCase());
      if (tracks.length > 0) {
        const firstTrack = tracks[0];
        title = firstTrack.album;
        desc = `Album by ${firstTrack.artist}`;
        art = firstTrack.art;
        stats = `${firstTrack.artist} &bull; ${tracks.length} songs`;
        bannerGradient = "linear-gradient(to bottom, rgb(48, 80, 120) 0%, var(--spotify-dark) 100%)";
      }
    } else {
      // Default: Liked Songs page!
      title = "Liked Songs";
      desc = "Your personal collection of favorite tracks.";
      art = "assets/playlists/top_hits.jpg"; // Fallback image or a custom heart image
      bannerGradient = "linear-gradient(to bottom, #503870 0%, var(--spotify-dark) 100%)";
      
      // Load only user liked tracks from localStorage
      tracks = SPOTIFY_DB.tracks.filter(t => localStorage.getItem(`liked_track_${t.id}`) === "true");
      const currentUsername = localStorage.getItem("spotify_username") || "Praveen Kumar";
      const displayName = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
      stats = `${displayName} &bull; ${tracks.length} songs`;
    }
    
    // Set banner gradient
    const mainView = document.querySelector(".main-view");
    if (mainView) {
      mainView.style.background = bannerGradient;
    }
    
    // Render Banner HTML
    bannerContainer.innerHTML = `
      <div class="playlist-header-details" style="display:flex; align-items:flex-end; gap:24px; padding:24px 32px 0 32px; margin-top:32px;">
        <img src="${art}" style="width:192px; height:192px; object-fit:cover; border-radius:4px; box-shadow:0 8px 24px rgba(0,0,0,0.5);" alt="">
        <div style="display:flex; flex-direction:column; gap:8px;">
          <span style="font-size:12px; font-weight:700; text-transform:uppercase;">Playlist</span>
          <h1 style="font-size:72px; font-weight:800; letter-spacing:-3px; margin: 4px 0 12px 0; line-height:1;">${title}</h1>
          <p style="font-size:14px; color:var(--text-muted); font-weight:500;">${desc}</p>
          <div style="font-size:14px; font-weight:700; margin-top:8px;">${stats}</div>
        </div>
      </div>
    `;
    
    // Render Track rows table list
    if (tracks.length === 0) {
      listContainer.innerHTML = `
        <div style="padding: 48px; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-music" style="font-size: 32px; margin-bottom: 12px;"></i>
          <p>No tracks in this collection yet.</p>
        </div>
      `;
      return;
    }
    
    listContainer.innerHTML = `
      <!-- Action buttons row -->
      <div style="display:flex; align-items:center; gap:24px; padding: 24px 32px;">
        <button class="badge" style="background-color:var(--spotify-green); color:var(--spotify-black); width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 4px 12px rgba(0,0,0,0.3);" onclick="playTrack(${tracks[0].id})">
          <i class="fa-solid fa-play" style="margin-left:4px;"></i>
        </button>
        <button style="font-size:32px; color:var(--text-muted); transition:color 0.2s;" onclick="showToast('Added to library')">
          <i class="fa-regular fa-heart"></i>
        </button>
        <button style="font-size:24px; color:var(--text-muted); transition:color 0.2s;">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <!-- Track List Table -->
      <div class="tracklist-container" style="padding: 0 32px 32px 32px;">
        <div class="track-row header-row">
          <div class="track-index">#</div>
          <div>Title</div>
          <div class="track-album">Album</div>
          <div></div>
          <div class="track-duration"><i class="fa-regular fa-clock"></i></div>
        </div>
        ${tracks.map((t, index) => {
          const isLiked = localStorage.getItem(`liked_track_${t.id}`) === "true";
          const isCurrent = t.id === SPOTIFY_DB.tracks[currentTrackIndex].id;
          return `
            <div class="track-row ${isCurrent && isPlaying ? 'playing' : ''}" data-track-id="${t.id}" onclick="playTrack(${t.id})">
              <div class="track-index">
                <span class="track-num-span">${index + 1}</span>
                <i class="fa-solid fa-play"></i>
              </div>
              <div class="track-main">
                <img src="${t.art}" class="track-art" alt="">
                <div class="track-meta">
                  <span class="track-title">${t.title}</span>
                  <span class="track-artist" onclick="event.stopPropagation(); viewArtistByName('${t.artist}')">${t.artist}</span>
                </div>
              </div>
              <div class="track-album" onclick="event.stopPropagation(); viewAlbum('${t.album}')">${t.album}</div>
              <div>
                <button class="track-fav ${isLiked ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleLikeTrackRow(this, ${t.id})">
                  <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
              </div>
              <div class="track-duration">${formatPlaylistDuration(t.duration)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  window.loadPlaylistView();
});

// Helper functions for playlist page
window.viewArtistByName = function(name) {
  const artist = SPOTIFY_DB.artists.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (artist) {
    viewArtist(artist.id);
  }
}

window.toggleLikeTrackRow = function(btn, id) {
  if (localStorage.getItem("spotify_logged_in") !== "true") {
    window.showLoginModal("login");
    return;
  }
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
  
  // Sync volume player heart button
  if (id === SPOTIFY_DB.tracks[currentTrackIndex].id) {
    const playerLike = document.getElementById("player-like");
    if (playerLike) {
      playerLike.classList.toggle("liked", !isCurrentlyLiked);
      playerLike.querySelector("i").className = !isCurrentlyLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }
  }
}

function formatPlaylistDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
