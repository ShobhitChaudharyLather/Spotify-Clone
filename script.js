// Sample data for playlists and songs with the new image paths
const playlists = [
    { id: 1, name: "Sapne Bade", image: "Img/c-d-x-PDX_a_82obo-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "3:00" },
    { id: 2, name: "Indian Bollywood", image: "Img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "4:00" },
    { id: 3, name: "Bollywood Song", image: "Img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "3:30" },
    { id: 4, name: "Remix Hits", image: "Img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "5:15" },
    { id: 5, name: "Classic Bollywood", image: "Img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "6:30" },
    { id: 6, name: "New Releases", image: "Img/ilyuza-mingazova-SLx3U_r2ack-unsplash.jpg", type: "playlist", artist: "Bollywood Artist", duration: "4:45" }
];

const songs = [
    { id: 1, title: "Sapne Bade", artist: "Bollywood Artist", album: "Hits Collection", duration: 180, image: "Img/c-d-x-PDX_a_82obo-unsplash.jpg", playlistId: 1 },
    { id: 2, title: "Dil Se", artist: "Bollywood Artist", album: "Hits Collection", duration: 210, image: "Img/c-d-x-PDX_a_82obo-unsplash.jpg", playlistId: 1 },
    { id: 3, title: "Indian Bollywood", artist: "Bollywood Artist", album: "Top Hits", duration: 240, image: "Img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg", playlistId: 2 },
    { id: 4, title: "Mumbai Dreams", artist: "Bollywood Artist", album: "Top Hits", duration: 195, image: "Img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg", playlistId: 2 },
    { id: 5, title: "Bollywood Song", artist: "Bollywood Artist", album: "Classic Collection", duration: 210, image: "Img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg", playlistId: 3 },
    { id: 6, title: "Romantic Ballad", artist: "Bollywood Artist", album: "Classic Collection", duration: 200, image: "Img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg", playlistId: 3 },
    { id: 7, title: "Remix Hits", artist: "Bollywood Artist", album: "Remix Collection", duration: 315, image: "Img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg", playlistId: 4 },
    { id: 8, title: "Party Mix", artist: "Bollywood Artist", album: "Remix Collection", duration: 290, image: "Img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg", playlistId: 4 },
    { id: 9, title: "Classic Bollywood", artist: "Bollywood Artist", album: "Golden Era", duration: 390, image: "Img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg", playlistId: 5 },
    { id: 10, title: "Evergreen Melodies", artist: "Bollywood Artist", album: "Golden Era", duration: 350, image: "Img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg", playlistId: 5 },
    { id: 11, title: "New Releases", artist: "Bollywood Artist", album: "Fresh Hits", duration: 285, image: "Img/ilyuza-mingazova-SLx3U_r2ack-unsplash.jpg", playlistId: 6 },
    { id: 12, title: "Latest Charts", artist: "Bollywood Artist", album: "Fresh Hits", duration: 265, image: "Img/ilyuza-mingazova-SLx3U_r2ack-unsplash.jpg", playlistId: 6 }
];

// Global variables
let currentSong = songs[2]; // Set initial song to "Indian Bollywood"
let isPlaying = true;
let volume = 0.7;
let isShuffle = false;
let repeatMode = 'none'; // 'none', 'all', 'one'
let currentPlaylist = playlists[1]; // Set initial playlist to match the current song
let audioPlayer = null;

// DOM Elements
const playlistGrid = document.querySelector('.grid');
const mainContent = document.querySelector('.main-content .content');
const playButton = document.getElementById('playButton');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const shuffleButton = document.getElementById('shuffleButton');
const repeatButton = document.getElementById('repeatButton');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const volumeIcon = document.getElementById('volumeIcon');
const searchInput = document.querySelector('.search-bar input');

// Initialize audio player
function initializeAudioPlayer() {
    audioPlayer = document.createElement('audio');
    document.body.appendChild(audioPlayer);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleSongEnd);
    audioPlayer.volume = volume;
    
    // Update volume fill initially
    updateVolumeFill();
    
    // Set initial progress
    audioPlayer.currentTime = 43; // 0:43 as shown in screenshot
    audioPlayer.duration = 91; // 1:31 as shown in screenshot
    updateProgress();
}

// Initialize the application
function init() {
    initializeAudioPlayer();
    setupEventListeners();
    updateNowPlaying(); // Update the "now playing" section with the current song
}

// Update the now playing section
function updateNowPlaying() {
    if (currentSong) {
        document.querySelector('.now-playing img').src = currentSong.image;
        document.querySelector('.song-info h4').textContent = currentSong.title;
        document.querySelector('.song-info p').textContent = currentSong.artist;
        
        durationDisplay.textContent = formatTime(currentSong.duration);
        
        if (isPlaying) {
            playButton.classList.replace('fa-play-circle', 'fa-pause-circle');
        } else {
            playButton.classList.replace('fa-pause-circle', 'fa-play-circle');
        }
    }
}

// Open a playlist and display its songs
function openPlaylist(playlist) {
    currentPlaylist = playlist;
    
    const playlistSongs = songs.filter(song => song.playlistId === playlist.id);
    
    mainContent.innerHTML = `
        <div class="playlist-header">
            <img src="${playlist.image}" alt="${playlist.name}">
            <div class="playlist-info">
                <p>${playlist.type.toUpperCase()}</p>
                <h1>${playlist.name}</h1>
                <p>${playlistSongs.length} songs</p>
            </div>
        </div>
        <div class="playlist-actions">
            <button class="play-btn"><i class="fas fa-play"></i></button>
            <button class="heart-btn"><i class="far fa-heart"></i></button>
            <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="songs-list">
            <div class="songs-header">
                <div class="song-number">#</div>
                <div class="song-title">TITLE</div>
                <div class="song-album">ALBUM</div>
                <div class="song-duration"><i class="far fa-clock"></i></div>
            </div>
            <div class="songs-container"></div>
        </div>
    `;
    
    const songsContainer = document.querySelector('.songs-container');
    
    playlistSongs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.dataset.id = song.id;
        
        songElement.innerHTML = `
            <div class="song-number">${index + 1}</div>
            <div class="song-title">
                <img src="${song.image}" alt="${song.title}">
                <div>
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            </div>
            <div class="song-album">${song.album}</div>
            <div class="song-duration">${formatTime(song.duration)}</div>
        `;
        
        songElement.addEventListener('click', () => playSong(song));
        songsContainer.appendChild(songElement);
    });
    
    // Add event listener to play button
    document.querySelector('.play-btn').addEventListener('click', () => {
        if (playlistSongs.length > 0) {
            playSong(playlistSongs[0]);
        }
    });
}

// Play a song
function playSong(song) {
    currentSong = song;
    
    // Update the now playing section
    document.querySelector('.now-playing img').src = song.image;
    document.querySelector('.song-info h4').textContent = song.title;
    document.querySelector('.song-info p').textContent = song.artist;
    
    // In a real application, we would set the audio source here
    // audioPlayer.src = song.audioUrl;
    
    // Since we don't have actual audio files, we'll simulate audio playback
    audioPlayer.duration = song.duration;
    if (isPlaying) {
        playAudio();
    } else {
        playButton.classList.replace('fa-pause-circle', 'fa-play-circle');
    }
    
    // Update song info display
    durationDisplay.textContent = formatTime(song.duration);
    
    // Highlight the current song in the playlist
    document.querySelectorAll('.song-item').forEach(item => {
        if (parseInt(item.dataset.id) === song.id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play or pause audio
function togglePlay() {
    if (!currentSong) return;
    
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Play audio
function playAudio() {
    audioPlayer.play();
    isPlaying = true;
    playButton.classList.replace('fa-play-circle', 'fa-pause-circle');
}

// Pause audio
function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    playButton.classList.replace('fa-pause-circle', 'fa-play-circle');
}

// Play previous song
function playPrevious() {
    if (!currentSong || !currentPlaylist) return;
    
    const playlistSongs = songs.filter(song => song.playlistId === currentPlaylist.id);
    const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
    
    let prevIndex;
    if (isShuffle) {
        prevIndex = Math.floor(Math.random() * playlistSongs.length);
    } else {
        prevIndex = currentIndex > 0 ? currentIndex - 1 : playlistSongs.length - 1;
    }
    
    playSong(playlistSongs[prevIndex]);
}

// Play next song
function playNext() {
    if (!currentSong || !currentPlaylist) return;
    
    const playlistSongs = songs.filter(song => song.playlistId === currentPlaylist.id);
    const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
    
    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * playlistSongs.length);
    } else {
        nextIndex = currentIndex < playlistSongs.length - 1 ? currentIndex + 1 : 0;
    }
    
    playSong(playlistSongs[nextIndex]);
}

// Handle song end
function handleSongEnd() {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        playAudio();
    } else if (repeatMode === 'all' || isShuffle) {
        playNext();
    } else {
        const playlistSongs = songs.filter(song => song.playlistId === currentPlaylist.id);
        const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
        
        if (currentIndex < playlistSongs.length - 1) {
            playNext();
        } else {
            pauseAudio();
            audioPlayer.currentTime = 0;
        }
    }
}

// Toggle shuffle mode
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleButton.classList.toggle('active', isShuffle);
}

// Toggle repeat mode
function toggleRepeat() {
    if (repeatMode === 'none') {
        repeatMode = 'all';
        repeatButton.classList.add('active');
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatButton.classList.add('active');
        repeatButton.classList.add('repeat-one');
    } else {
        repeatMode = 'none';
        repeatButton.classList.remove('active');
        repeatButton.classList.remove('repeat-one');
    }
}

// Update song progress
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

// Set progress when user clicks on progress bar
function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Update volume
function setVolume(e) {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    
    volume = clickX / width;
    audioPlayer.volume = volume;
    
    updateVolumeFill();
    updateVolumeIcon();
}

// Update volume fill
function updateVolumeFill() {
    volumeFill.style.width = `${volume * 100}%`;
}

// Update volume icon based on volume level
function updateVolumeIcon() {
    volumeIcon.className = 'fas';
    
    if (volume === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (volume < 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
}

// Toggle mute
function toggleMute() {
    if (audioPlayer.volume > 0) {
        // Store the previous volume
        audioPlayer.dataset.prevVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        volume = 0;
    } else {
        // Restore the previous volume or set to default
        const prevVolume = parseFloat(audioPlayer.dataset.prevVolume) || 0.7;
        audioPlayer.volume = prevVolume;
        volume = prevVolume;
    }
    
    updateVolumeFill();
    updateVolumeIcon();
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        // Return to home view
        mainContent.innerHTML = `
            <div class="greeting">
                <h1>Good afternoon</h1>
            </div>
            <div class="bollywood-hits">
                <h2>Bollywood Hits</h2>
                <div class="grid"></div>
            </div>
        `;
        
        // Re-populate the grid with playlist cards
        const grid = document.querySelector('.grid');
        playlists.forEach(playlist => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            playlistCard.dataset.id = playlist.id;
            
            playlistCard.innerHTML = `
                <img src="${playlist.image}" alt="${playlist.name}">
                <h3>${playlist.name}</h3>
                <p>${playlist.artist}</p>
                <span>${playlist.duration}</span>
            `;
            
            playlistCard.addEventListener('click', () => openPlaylist(playlist));
            grid.appendChild(playlistCard);
        });
        
        return;
    }
    
    // Filter playlists and songs by search term
    const filteredPlaylists = playlists.filter(playlist => 
        playlist.name.toLowerCase().includes(searchTerm)
    );
    
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm) || 
        song.artist.toLowerCase().includes(searchTerm) ||
        song.album.toLowerCase().includes(searchTerm)
    );
    
    // Display search results
    displaySearchResults(filteredPlaylists, filteredSongs);
}

// Display search results
function displaySearchResults(filteredPlaylists, filteredSongs) {
    mainContent.innerHTML = `
        <div class="search-results">
            <h1>Search Results</h1>
            
            <div class="result-section">
                <h2>Playlists</h2>
                <div class="results-grid playlists-results"></div>
            </div>
            
            <div class="result-section">
                <h2>Songs</h2>
                <div class="songs-list">
                    <div class="songs-header">
                        <div class="song-title">TITLE</div>
                        <div class="song-album">ALBUM</div>
                        <div class="song-duration"><i class="far fa-clock"></i></div>
                    </div>
                    <div class="songs-container search-songs-container"></div>
                </div>
            </div>
        </div>
    `;
    
    const playlistsResultsContainer = document.querySelector('.playlists-results');
    const songsContainer = document.querySelector('.search-songs-container');
    
    // Display playlists
    if (filteredPlaylists.length > 0) {
        filteredPlaylists.forEach(playlist => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            playlistCard.dataset.id = playlist.id;
            
            playlistCard.innerHTML = `
                <img src="${playlist.image}" alt="${playlist.name}">
                <h3>${playlist.name}</h3>
                <p>${playlist.artist}</p>
                <span>${playlist.duration}</span>
            `;
            
            playlistCard.addEventListener('click', () => openPlaylist(playlist));
            playlistsResultsContainer.appendChild(playlistCard);
        });
    } else {
        playlistsResultsContainer.innerHTML = '<p class="no-results">No playlists found</p>';
    }
    
    // Display songs
    if (filteredSongs.length > 0) {
        filteredSongs.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.dataset.id = song.id;
            
            songElement.innerHTML = `
                <div class="song-title">
                    <img src="${song.image}" alt="${song.title}">
                    <div>
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${formatTime(song.duration)}</div>
            `;
            
            songElement.addEventListener('click', () => {
                const playlist = playlists.find(p => p.id === song.playlistId);
                currentPlaylist = playlist;
                playSong(song);
            });
            
            songsContainer.appendChild(songElement);
        });
    } else {
        songsContainer.innerHTML = '<p class="no-results">No songs found</p>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Player controls
    playButton.addEventListener('click', togglePlay);
    previousButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    shuffleButton.addEventListener('click', toggleShuffle);
    repeatButton.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('click', setProgress);
    
    // Volume controls
    volumeBar.addEventListener('click', setVolume);
    volumeIcon.addEventListener('click', toggleMute);
    
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Navigation
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar nav ul li').forEach(li => {
                li.classList.remove('active');
            });
            
            item.classList.add('active');
            
            if (item.textContent.includes('Home')) {
                mainContent.innerHTML = `
                    <div class="greeting">
                        <h1>Good afternoon</h1>
                    </div>
                    <div class="bollywood-hits">
                        <h2>Bollywood Hits</h2>
                        <div class="grid"></div>
                    </div>
                `;
                
                // Re-populate the grid with playlist cards
                const grid = document.querySelector('.grid');
                playlists.forEach(playlist => {
                    const playlistCard = document.createElement('div');
                    playlistCard.className = 'playlist-card';
                    playlistCard.dataset.id = playlist.id;
                    
                    playlistCard.innerHTML = `
                        <img src="${playlist.image}" alt="${playlist.name}">
                        <h3>${playlist.name}</h3>
                        <p>${playlist.artist}</p>
                        <span>${playlist.duration}</span>
                    `;
                    
                    playlistCard.addEventListener('click', () => openPlaylist(playlist));
                    grid.appendChild(playlistCard);
                });
            }
        });
    });
}