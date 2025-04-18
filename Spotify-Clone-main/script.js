// Sample playlist data
const playlists = [
    {
        id: '1',
        name: "Bollywood Hits",
        description: "The best of Bollywood music",
        image: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
        tracks: [
            {
                id: '1',
                name: "Sapne Bade",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg",
                duration: 180,
                previewUrl: "songs/sapne-bade-305719.mp3"
            },
            {
                id: '2',
                name: "Indian Bollywood",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg",
                duration: 240,
                previewUrl: "songs/indian-bollywood-hindi-song-background-music-293028.mp3"
            },
            {
                id: '3',
                name: "Bollywood Song",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg",
                duration: 210,
                previewUrl: "songs/bollywood-song-313044.mp3"
            }
        ]
    },
    {
        id: '2',
        name: "Hip Hop Mix",
        description: "Fresh hip hop beats and tracks",
        image: "cover img/c-d-x-PDX_a_82obo-unsplash.jpg",
        tracks: [
            {
                id: '4',
                name: "Soul Sweeper",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-SLx3U_r2ack-unsplash.jpg",
                duration: 195,
                previewUrl: "songs/soulsweeper-252499.mp3"
            },
            {
                id: '5',
                name: "Vlog Music",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
                duration: 165,
                previewUrl: "songs/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3"
            },
            {
                id: '6',
                name: "Don't Talk",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg",
                duration: 210,
                previewUrl: "songs/dont-talk-315229.mp3"
            },
            {
                id: '7',
                name: "Experimental Hip Hop",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg",
                duration: 180,
                previewUrl: "songs/experimental-cinematic-hip-hop-315904.mp3"
            },
            {
                id: '8',
                name: "Gorila",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg",
                duration: 195,
                previewUrl: "songs/gorila-315977.mp3"
            }
        ]
    }
];

// Loved songs playlist
let lovedSongsPlaylist = {
    id: 'loved',
    name: "Liked Songs",
    description: "Your favorite tracks",
    image: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
    tracks: []
};

// Audio player setup
const audio = new Audio();
let currentTrack = null;
let isPlaying = false;
let currentPlaylist = null;
let isShuffle = false;
let isRepeat = false;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Initialize the app
function init() {
    // DOM elements
    const playlistContainer = document.querySelector('.grid');
    const nowPlaying = document.querySelector('.now-playing');
    const playerControls = document.querySelector('.player-controls');
    const progressBar = document.getElementById('progressFill');
    const volumeSlider = document.getElementById('volumeFill');
    const volumeIcon = document.getElementById('volumeIcon');
    const playButton = document.getElementById('playButton');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const repeatButton = document.getElementById('repeatButton');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const heartIcon = document.querySelector('.now-playing .fa-heart');
    
    // Add loved songs playlist to the list
    playlists.push(lovedSongsPlaylist);
    
    displayPlaylists();
    setupEventListeners();
    
    // Set initial volume
    updateVolume(0.7);
}

// Display playlists
function displayPlaylists() {
    const playlistContainer = document.querySelector('.grid');
    playlistContainer.innerHTML = playlists.map(playlist => `
        <div class="playlist-card" onclick="selectPlaylist('${playlist.id}')">
            <img src="${playlist.image}" alt="${playlist.name}">
            <h3>${playlist.name}</h3>
            <p>${playlist.description}</p>
        </div>
    `).join('');
}

// Select playlist and display tracks
function selectPlaylist(playlistId) {
    currentPlaylist = playlists.find(p => p.id === playlistId);
    displayTracks(currentPlaylist.tracks);
}

// Display tracks
function displayTracks(tracks) {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear previous track list
    
    // Add back the greeting
    const greeting = document.createElement('div');
    greeting.className = 'greeting';
    greeting.innerHTML = '<h1>Good afternoon</h1>';
    content.appendChild(greeting);
    
    // Add playlist title
    const playlistTitle = document.createElement('h2');
    playlistTitle.textContent = currentPlaylist.name;
    content.appendChild(playlistTitle);

    const trackList = document.createElement('div');
    trackList.className = 'track-list';
    trackList.innerHTML = tracks.map(track => `
        <div class="track-item" onclick="playTrack('${track.id}')">
            <img src="${track.albumImage}" alt="${track.name}">
            <div class="track-info">
                <h4>${track.name}</h4>
                <p>${track.artists.join(', ')}</p>
            </div>
            <span class="duration">${formatTime(track.duration)}</span>
            <i class="${lovedSongsPlaylist.tracks.some(t => t.id === track.id) ? 'fas' : 'far'} fa-heart" onclick="event.stopPropagation(); addToLovedSongs('${track.id}')"></i>
        </div>
    `).join('');

    content.appendChild(trackList);
}

// Add track to loved songs
function addToLovedSongs(trackId) {
    // Find the track in all playlists
    let track = null;
    for (const playlist of playlists) {
        if (playlist.id !== 'loved') {
            const foundTrack = playlist.tracks.find(t => t.id === trackId);
            if (foundTrack) {
                track = foundTrack;
                break;
            }
        }
    }

    if (track) {
        // Check if track is already in loved songs
        const isAlreadyLoved = lovedSongsPlaylist.tracks.some(t => t.id === trackId);
        
        if (!isAlreadyLoved) {
            // Add track to loved songs
            lovedSongsPlaylist.tracks.push(track);
            
            // Update heart icon in now playing if this is the current track
            const heartIcon = document.querySelector('.now-playing .fa-heart');
            if (currentTrack && currentTrack.id === trackId) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            // Show notification
            showNotification('Added to Liked Songs');
        } else {
            // Remove track from loved songs
            lovedSongsPlaylist.tracks = lovedSongsPlaylist.tracks.filter(t => t.id !== trackId);
            
            // Update heart icon in now playing if this is the current track
            const heartIcon = document.querySelector('.now-playing .fa-heart');
            if (currentTrack && currentTrack.id === trackId) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
            
            // Show notification
            showNotification('Removed from Liked Songs');
        }
        
        // If currently displaying the loved songs playlist, refresh the display
        if (currentPlaylist && currentPlaylist.id === 'loved') {
            displayTracks(lovedSongsPlaylist.tracks);
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Play track
function playTrack(trackId) {
    const track = currentPlaylist.tracks.find(t => t.id === trackId);
    if (!track) return;

    currentTrack = track;
    audio.src = track.previewUrl;
    audio.play();
    isPlaying = true;
    updateNowPlaying();
    updatePlayerControls();
    
    // Update heart icon based on whether track is in loved songs
    const heartIcon = document.querySelector('.now-playing .fa-heart');
    const isLoved = lovedSongsPlaylist.tracks.some(t => t.id === trackId);
    heartIcon.className = isLoved ? 'fas fa-heart' : 'far fa-heart';
}

// Update now playing display
function updateNowPlaying() {
    const nowPlaying = document.querySelector('.now-playing');
    const songInfo = nowPlaying.querySelector('.song-info');
    songInfo.innerHTML = `
        <h4>${currentTrack.name}</h4>
        <p>${currentTrack.artists.join(', ')}</p>
    `;
    nowPlaying.querySelector('img').src = currentTrack.albumImage;
}

// Setup event listeners
function setupEventListeners() {
    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextTrack);
    
    // Player control events
    const playButton = document.getElementById('playButton');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const repeatButton = document.getElementById('repeatButton');
    const heartIcon = document.querySelector('.now-playing .fa-heart');
    
    playButton.addEventListener('click', togglePlay);
    previousButton.addEventListener('click', playPreviousTrack);
    nextButton.addEventListener('click', playNextTrack);
    shuffleButton.addEventListener('click', toggleShuffle);
    repeatButton.addEventListener('click', toggleRepeat);
    
    // Heart icon click
    heartIcon.addEventListener('click', () => {
        if (currentTrack) {
            addToLovedSongs(currentTrack.id);
        }
    });
    
    // Progress bar click
    const progressContainer = document.getElementById('progressBar');
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickPercent = x / rect.width;
        audio.currentTime = clickPercent * audio.duration;
    });
    
    // Volume control
    const volumeBar = document.getElementById('volumeBar');
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const volume = x / rect.width;
        updateVolume(volume);
    });
    
    // Volume icon click (mute/unmute)
    const volumeIcon = document.getElementById('volumeIcon');
    volumeIcon.addEventListener('click', toggleMute);
}

// Update progress bar
function updateProgress() {
    const progressBar = document.getElementById('progressFill');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    
    const progress = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime || 0);
    durationDisplay.textContent = formatTime(audio.duration || 0);
}

// Toggle play/pause
function togglePlay() {
    const playButton = document.getElementById('playButton');
    
    if (!currentTrack) {
        // If no track is selected, play the first track of the first playlist
        if (playlists.length > 0 && playlists[0].tracks.length > 0) {
            currentPlaylist = playlists[0];
            playTrack(playlists[0].tracks[0].id);
        }
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    
    updatePlayerControls();
}

// Toggle mute
function toggleMute() {
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeFill = document.getElementById('volumeFill');
    
    if (audio.volume > 0) {
        // Store the current volume so we can restore it later
        audio.dataset.previousVolume = audio.volume;
        updateVolume(0);
    } else {
        // Restore previous volume or default to 0.7
        updateVolume(audio.dataset.previousVolume || 0.7);
    }
}

// Play next track
function playNextTrack() {
    if (!currentPlaylist || !currentTrack) return;

    if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
        playTrack(currentPlaylist.tracks[randomIndex].id);
    } else {
        const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= currentPlaylist.tracks.length) {
            if (isRepeat) {
                nextIndex = 0;
            } else {
                // Stop playing if not on repeat
                audio.pause();
                isPlaying = false;
                updatePlayerControls();
                return;
            }
        }

        playTrack(currentPlaylist.tracks[nextIndex].id);
    }
}

// Play previous track
function playPreviousTrack() {
    if (!currentPlaylist || !currentTrack) return;
    
    // If we're more than 3 seconds into the track, restart instead of going to previous
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex].id);
}

// Toggle shuffle
function toggleShuffle() {
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.classList.toggle('active');
    isShuffle = !isShuffle;
}

// Toggle repeat
function toggleRepeat() {
    const repeatButton = document.getElementById('repeatButton');
    repeatButton.classList.toggle('active');
    isRepeat = !isRepeat;
}

// Update volume
function updateVolume(volume) {
    audio.volume = volume;
    const volumeFill = document.getElementById('volumeFill');
    volumeFill.style.width = `${volume * 100}%`;
    updateVolumeIcon(volume);
}

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
    const volumeIcon = document.getElementById('volumeIcon');
    
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update player controls
function updatePlayerControls() {
    const playButton = document.getElementById('playButton');
    playButton.className = isPlaying ? 'fas fa-pause-circle' : 'fas fa-play-circle';
}