/* player.js - Spotify UI Music Player Playback Controls Script */

document.addEventListener("DOMContentLoaded", () => {
  initPlayerUI();
  setupAudioEvents();
});

// Setup Initial Player State
function initPlayerUI() {
  const currentTrack = SPOTIFY_DB.tracks[currentTrackIndex];
  updatePlayerUI(currentTrack);
  
  // Bind UI Controls
  const playPauseBtn = document.getElementById("player-play-pause");
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlay);
  }
  
  const prevBtn = document.getElementById("player-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", playPreviousTrack);
  }
  
  const nextBtn = document.getElementById("player-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", playNextTrack);
  }
  
  const shuffleBtn = document.getElementById("player-shuffle");
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", toggleShuffle);
  }
  
  const repeatBtn = document.getElementById("player-repeat");
  if (repeatBtn) {
    repeatBtn.addEventListener("click", toggleRepeat);
  }
  
  // Like button
  const likeBtn = document.getElementById("player-like");
  if (likeBtn) {
    likeBtn.addEventListener("click", toggleLikeActiveTrack);
  }

  // Seek bar
  const seekBar = document.getElementById("player-seek-bar");
  if (seekBar) {
    seekBar.addEventListener("click", seekAudio);
  }
  
  // Volume bar
  const volumeBar = document.getElementById("player-volume-bar");
  if (volumeBar) {
    volumeBar.addEventListener("click", setVolume);
  }
  
  const volumeIcon = document.getElementById("player-volume-icon");
  if (volumeIcon) {
    volumeIcon.addEventListener("click", toggleMute);
  }
}

// Update Player Panel UI Elements
function updatePlayerUI(track) {
  if (!track) return;
  
  const art = document.getElementById("player-art");
  const title = document.getElementById("player-title");
  const artist = document.getElementById("player-artist");
  const durationTotal = document.getElementById("player-duration-total");
  const likeBtn = document.getElementById("player-like");
  
  if (art) art.src = track.art;
  if (title) title.textContent = track.title;
  if (artist) {
    artist.textContent = track.artist;
    artist.onclick = () => {
      // Find artist ID
      const artObj = SPOTIFY_DB.artists.find(a => a.name.toLowerCase() === track.artist.toLowerCase());
      if (artObj) viewArtist(artObj.id);
    };
  }
  if (durationTotal) durationTotal.textContent = formatTime(track.duration);
  
  // Sync Favorites Class
  if (likeBtn) {
    const isLiked = localStorage.getItem(`liked_track_${track.id}`) === "true";
    if (isLiked) {
      likeBtn.classList.add("liked");
      likeBtn.querySelector("i").className = "fa-solid fa-heart";
    } else {
      likeBtn.classList.remove("liked");
      likeBtn.querySelector("i").className = "fa-regular fa-heart";
    }
  }
  
  // Sync Active Playlist Row Highlighting (if applicable)
  const allRows = document.querySelectorAll(".track-row");
  allRows.forEach(row => {
    row.classList.remove("playing");
    if (parseInt(row.dataset.trackId) === track.id) {
      row.classList.add("playing");
      
      const playIcon = row.querySelector(".fa-play");
      const numSpan = row.querySelector(".track-num-span");
      
      if (isPlaying) {
        if (playIcon) playIcon.style.display = "none";
        if (numSpan) numSpan.style.display = "none";
      } else {
        if (playIcon) playIcon.style.display = "inline-block";
        if (numSpan) numSpan.style.display = "none";
      }
    }
  });
}

// Bind HTML Audio Element Status triggers
function setupAudioEvents() {
  audioPlayer.addEventListener("timeupdate", () => {
    const duration = audioPlayer.duration || SPOTIFY_DB.tracks[currentTrackIndex].duration;
    const progressPercent = (audioPlayer.currentTime / duration) * 100;
    
    // Update progress bar
    const progressFill = document.getElementById("player-progress-fill");
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    
    // Update timestamps
    const curTimeEl = document.getElementById("player-current-time");
    if (curTimeEl) {
      curTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });
  
  audioPlayer.addEventListener("ended", () => {
    if (isRepeat) {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
    } else {
      playNextTrack();
    }
  });
}

// Global Play Function
window.playTrack = function(trackId) {
  const targetIndex = SPOTIFY_DB.tracks.findIndex(t => t.id === trackId);
  if (targetIndex !== -1) {
    currentTrackIndex = targetIndex;
    const track = SPOTIFY_DB.tracks[currentTrackIndex];
    
    // Update player source
    audioPlayer.src = track.audioUrl;
    updatePlayerUI(track);
    
    // Play audio
    isPlaying = true;
    audioPlayer.play().then(() => {
      updatePlayPauseButton();
    }).catch(err => {
      console.warn("Autoplay block or audio fetch failed. Fallback simulation.", err);
      // Fallback: Simulate progress updates for offline/blocked browsers
      simulatePlayback(track);
    });
  }
}

// Toggle Play / Pause state
function togglePlay() {
  if (isPlaying) {
    isPlaying = false;
    audioPlayer.pause();
    if (window.playbackSimInterval) clearInterval(window.playbackSimInterval);
  } else {
    isPlaying = true;
    if (!audioPlayer.src) {
      const track = SPOTIFY_DB.tracks[currentTrackIndex];
      audioPlayer.src = track.audioUrl;
    }
    
    audioPlayer.play().then(() => {
      updatePlayPauseButton();
    }).catch(() => {
      simulatePlayback(SPOTIFY_DB.tracks[currentTrackIndex]);
    });
  }
  updatePlayPauseButton();
  updatePlayerUI(SPOTIFY_DB.tracks[currentTrackIndex]);
}

function updatePlayPauseButton() {
  const btn = document.getElementById("player-play-pause");
  if (btn) {
    btn.querySelector("i").className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }
}

// Next Track logic
function playNextTrack() {
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * SPOTIFY_DB.tracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % SPOTIFY_DB.tracks.length;
  }
  playTrack(SPOTIFY_DB.tracks[currentTrackIndex].id);
}

// Previous Track logic
function playPreviousTrack() {
  if (audioPlayer.currentTime > 3) {
    // Restart current song
    audioPlayer.currentTime = 0;
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + SPOTIFY_DB.tracks.length) % SPOTIFY_DB.tracks.length;
    playTrack(SPOTIFY_DB.tracks[currentTrackIndex].id);
  }
}

// Audio Simulation (for browser sandbox restrictions)
function simulatePlayback(track) {
  if (window.playbackSimInterval) clearInterval(window.playbackSimInterval);
  
  window.playbackSimInterval = setInterval(() => {
    if (!isPlaying) {
      clearInterval(window.playbackSimInterval);
      return;
    }
    
    audioPlayer.currentTime += 1;
    if (audioPlayer.currentTime >= track.duration) {
      audioPlayer.currentTime = 0;
      playNextTrack();
    }
    
    // Fire manual timeupdate event to trigger timeline updates
    const event = new Event("timeupdate");
    audioPlayer.dispatchEvent(event);
  }, 1000);
}

// Toggle Shuffle state
function toggleShuffle() {
  isShuffle = !isShuffle;
  const btn = document.getElementById("player-shuffle");
  if (btn) {
    btn.classList.toggle("active", isShuffle);
  }
  showToast(isShuffle ? "Shuffle play enabled" : "Shuffle play disabled");
}

// Toggle Repeat state
function toggleRepeat() {
  isRepeat = !isRepeat;
  const btn = document.getElementById("player-repeat");
  if (btn) {
    btn.classList.toggle("active", isRepeat);
  }
  showToast(isRepeat ? "Repeat track enabled" : "Repeat track disabled");
}

// Toggle Heart Like Songs
function toggleLikeActiveTrack() {
  const track = SPOTIFY_DB.tracks[currentTrackIndex];
  const itemKey = `liked_track_${track.id}`;
  const isCurrentlyLiked = localStorage.getItem(itemKey) === "true";
  
  localStorage.setItem(itemKey, !isCurrentlyLiked);
  updatePlayerUI(track);
  showToast(!isCurrentlyLiked ? "Added to Liked Songs" : "Removed from Liked Songs");
  
  // Re-sync playlist view (if viewing Liked Songs page)
  if (window.loadPlaylistView) {
    window.loadPlaylistView();
  }
}

// Seek position inside progress bar
function seekAudio(e) {
  const seekBar = document.getElementById("player-seek-bar");
  if (!seekBar) return;
  
  const rect = seekBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  
  const duration = audioPlayer.duration || SPOTIFY_DB.tracks[currentTrackIndex].duration;
  audioPlayer.currentTime = percent * duration;
  
  const progressFill = document.getElementById("player-progress-fill");
  if (progressFill) progressFill.style.width = `${percent * 100}%`;
}

// Set volume slider
function setVolume(e) {
  const volumeBar = document.getElementById("player-volume-bar");
  if (!volumeBar) return;
  
  const rect = volumeBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, clickX / rect.width));
  
  audioPlayer.volume = percent;
  
  const volumeFill = document.getElementById("player-volume-fill");
  if (volumeFill) volumeFill.style.width = `${percent * 100}%`;
  
  updateVolumeIcon(percent);
}

function toggleMute() {
  const icon = document.getElementById("player-volume-icon");
  const volumeFill = document.getElementById("player-volume-fill");
  
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
    icon.className = "fa-solid fa-volume-high";
    if (volumeFill) volumeFill.style.width = `${audioPlayer.volume * 100}%`;
  } else {
    audioPlayer.muted = true;
    icon.className = "fa-solid fa-volume-xmark";
    if (volumeFill) volumeFill.style.width = "0%";
  }
}

function updateVolumeIcon(volume) {
  const icon = document.getElementById("player-volume-icon");
  if (!icon) return;
  
  if (volume === 0) {
    icon.className = "fa-solid fa-volume-xmark";
  } else if (volume < 0.4) {
    icon.className = "fa-solid fa-volume-low";
  } else {
    icon.className = "fa-solid fa-volume-high";
  }
}

// Time formatting utility (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
