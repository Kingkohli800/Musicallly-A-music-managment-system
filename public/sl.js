// Function to switch to the Artist section
function switchToArtistSection() {
    // Hide Musically Playlist section
    document.querySelector('.MusicallyPlaylist').style.display = 'none';
    // Hide Podcast section
    document.querySelector('.podcast').style.display = 'none';
    // Show Artist section
    document.querySelector('.Artist').style.display = 'block';
}

// Function to switch to the Musically Playlist section
function switchToMusicallyPlaylistSection() {
    // Hide Artist section
    document.querySelector('.Artist').style.display = 'none';
    // Hide Podcast section
    document.querySelector('.podcast').style.display = 'none';
    // Show Musically Playlist section
    document.querySelector('.MusicallyPlaylist').style.display = 'block';
}

// Function to switch to the Podcast section
function switchToPodcastSection() {
    // Hide Artist section
    document.querySelector('.Artist').style.display = 'none';
    // Hide Musically Playlist section
    document.querySelector('.MusicallyPlaylist').style.display = 'none';
    // Show Podcast section
    document.querySelector('.podcast').style.display = 'block';
}

// Function to set the initial active section
function setInitialActiveSection() {
    // Retrieve the active section from local storage
    const activeSection = localStorage.getItem('activeSection');
    
    // Check if the active section is 'artist'
    if (activeSection === 'artist') {
        switchToArtistSection();
    } 
    // Check if the active section is 'podcast'
    else if (activeSection === 'podcast') {
        switchToPodcastSection();
    } 
    // Default to Musically Playlist section if no active section is found
    else {
        switchToMusicallyPlaylistSection();
    }
}

// Call the function to set the initial active section
setInitialActiveSection();
