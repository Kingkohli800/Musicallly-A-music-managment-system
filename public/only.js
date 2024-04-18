let currentLikedIndex = 0; // Keep track of the currently playing liked song index
let likedSongModeActive = false; // Flag to indicate if liked song mode is active

// Function to toggle liked song mode
function toggleLikedSongMode() {
    likedSongModeActive = !likedSongModeActive; // Toggle the flag
    const toggleButton = document.getElementById("toggleLikedSongModeBtn");
    if (likedSongModeActive) {
        console.log("Liked song mode activated");
        toggleButton.classList.add("glowing");
        playNextLikedSong(); // Start playing the first liked song
        // Add event listeners to the "Next" and "Previous" buttons
        next.addEventListener("click", nextButtonHandler);
        prev.addEventListener("click", prevButtonHandler);
    } else {
        console.log("Liked song mode deactivated");
        toggleButton.classList.remove("glowing");
        // Remove event listeners from the "Next" and "Previous" buttons
        next.removeEventListener("click", nextButtonHandler);
        prev.removeEventListener("click", prevButtonHandler);
    }
}

// Function to play the next liked song
function playNextLikedSong() {
    if (likedSongs.length === 0 || !likedSongModeActive) return; // Check if liked song mode is active and if there are any liked songs
    currentLikedIndex = (currentLikedIndex + 1) % likedSongs.length; // Increment index and loop back if necessary
    playMusic(likedSongs[currentLikedIndex]); // Play the next liked song
}

// Function to play the previous liked song
function playPrevLikedSong() {
    if (likedSongs.length === 0 || !likedSongModeActive) return; // Check if liked song mode is active and if there are any liked songs
    currentLikedIndex = (currentLikedIndex - 1 + likedSongs.length) % likedSongs.length; // Decrement index and loop back if necessary
    playMusic(likedSongs[currentLikedIndex]); // Play the previous liked song
}

// Function to handle song completion
currentSong.addEventListener('ended', () => {
    if (likedSongModeActive) {
        // If liked song mode is active, play the next liked song
        playNextLikedSong();
    } else {
        // If liked song mode is not active, play the next song
        playNextSong();
    }
});

// Event listener for the "Toggle" button
toggleLikedSongModeBtn.addEventListener("click", () => {
    toggleLikedSongMode();
});

// Event listener for the "Next" button
function nextButtonHandler() {
    currentSong.pause();
    console.log("Next clicked");
    playNextLikedSong();
}

// Event listener for the "Previous" button
function prevButtonHandler() {
    currentSong.pause();
    console.log("Previous clicked");
    playPrevLikedSong();
}