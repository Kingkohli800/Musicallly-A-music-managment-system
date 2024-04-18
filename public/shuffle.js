document.addEventListener("DOMContentLoaded", function() {
    let isShuffling = false; // Variable to track shuffle state
    let defaultOrder = []; // Variable to store default order of songs

    const shuffleImage = document.getElementById("shuffle");

    shuffleImage.addEventListener("click", function() {
        if (isShuffling) {
            stopShuffle(); // If shuffling, stop shuffling
        } else {
            startShuffle(); // If not shuffling, start shuffling
        }
    });

    // Function to start shuffle
    function startShuffle() {
        isShuffling = true;
        defaultOrder = [...songs]; // Store default order before shuffling
        shuffleSongs(); // Start shuffling all songs
        shuffleImage.classList.add("glowing"); // Add glowing effect to the shuffle image
        // Optionally, you can display a message or change the shuffle button appearance
        console.log("Shuffle started");
    }

    // Function to stop shuffle
    function stopShuffle() {
        isShuffling = false;
        songs = [...defaultOrder]; // Reset songs array to default order
        shuffleImage.classList.remove("glowing"); // Remove glowing effect from the shuffle image
        // Optionally, you can reset the current playing song or perform any other cleanup actions
        console.log("Shuffle stopped");
    }

    // Function to shuffle songs
    function shuffleSongs() {
        // Perform shuffle logic
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        console.log("Songs shuffled:", songs);
    }
});
