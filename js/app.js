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

// Initialize user details
document.addEventListener("DOMContentLoaded", () => {
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
  }
  
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
