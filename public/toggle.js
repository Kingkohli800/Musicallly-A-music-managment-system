// Function to toggle the visibility of the image and metadata
function togglePlayerView() {
    const image = document.querySelector('.song-image');
    const metadataLeft = document.querySelector('.metadata-left');
    const metadataRight = document.querySelector('.metadata-right');

    // Toggle visibility by toggling the 'hidden' class
    image.classList.toggle('hidden');
    metadataLeft.classList.toggle('hidden');
    metadataRight.classList.toggle('hidden');
}

// Add click event listener to the player element
const player = document.querySelector('.player');
player.addEventListener('click', togglePlayerView);


