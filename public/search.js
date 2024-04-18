// Function to filter songs based on search query
function filterSongs(query) {
    const replacedQuery = replaceAll(query, "%20", " ");
    const filteredSongs = songs.filter(song => song.toLowerCase().includes(replacedQuery.toLowerCase()));
    return filteredSongs;
}

// Function to replace all occurrences of a specific word or phrase with a space
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

// Function to update the search results display with filtered songs
function updateSearchResults(filteredSongs) {
    const searchResultDiv = document.querySelector(".searchresult");
    searchResultDiv.innerHTML = "";
    if (filteredSongs.length === 0) {
        searchResultDiv.textContent = "No matching songs found."; 
    } else {
        const ul = document.createElement("ul");
        filteredSongs.forEach(song => {
            const li = document.createElement("li");
            const decodedSongName = decodeURIComponent(song); // Decode special characters
            li.innerHTML = `${decodedSongName.replaceAll("http://127.0.0.1:5500/public/songs/", "").replaceAll("%20", " ")}<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
            <svg width="26px" height="26px" viewBox="0 0 24 24" fill="none">
            <path d="M13.8876 9.9348C14.9625 10.8117 15.5 11.2501 15.5 12C15.5 12.7499 14.9625 13.1883 13.8876 14.0652C13.5909 14.3073 13.2966 14.5352 13.0261 14.7251C12.7888 14.8917 12.5201 15.064 12.2419 15.2332C11.1695 15.8853 10.6333 16.2114 10.1524 15.8504C9.6715 15.4894 9.62779 14.7336 9.54038 13.2222C9.51566 12.7947 9.5 12.3757 9.5 12C9.5 11.6243 9.51566 11.2053 9.54038 10.7778C9.62779 9.26636 9.6715 8.51061 10.1524 8.1496C10.6333 7.78859 11.1695 8.11466 12.2419 8.76679C12.5201 8.93597 12.7888 9.10831 13.0261 9.27492C13.2966 9.46483 13.5909 9.69274 13.8876 9.9348Z" stroke="#FFFFFF" stroke-width="1.5"/>
            <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        
            <button class="like"></button>`; // Add SVG icon and replace path and decode special characters
            li.addEventListener("click", () => {
                playSong(song);
            });
            ul.appendChild(li);
        });
        searchResultDiv.appendChild(ul);
    }
}

// Event listener for search input field (real-time search)
document.querySelector("#searchInput").addEventListener("input", () => {
    const query = document.querySelector("#searchInput").value.trim();
    if (query === "") {
        // If search input is empty, clear search results
        document.querySelector(".searchresult").innerHTML = "";
    } else {
        // If search input has text, filter songs and update search results
        const filteredSongs = filterSongs(query);
        updateSearchResults(filteredSongs);
    }
});

// Function to play a song
function playSong(songName) {
    const track = decodeURIComponent(songName);
    currentSong.src = `/${currFolder}/` + track;
    currentSong.addEventListener('canplaythrough', function() {
        currentSong.play(); // Play the song once it's ready
    });
    playsong.src = "pause.svg";
    // Update UI or perform any other actions related to playing the song
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".duration").innerHTML = "00:00";
}


// Event listener for search result list items
document.addEventListener("click", function(event) {
    const target = event.target;
    if (target.matches(".searchresult ul li")) {
        const songName = target.textContent.trim(); // Get the text content of the clicked item
        playSong(songName); // Call the function to play the song
    }
});

// Event listener for document click to clear search results and input field when clicking outside the search result area
document.addEventListener("click", function(event) {
    const target = event.target;
    const searchResultDiv = document.querySelector(".searchresult");
    const searchInput = document.querySelector("#searchInput");

    // Check if the click occurred outside the search result area
    if (!searchResultDiv.contains(target) && target.id !== "searchInput") {
        searchResultDiv.innerHTML = ""; // Clear search results
        searchInput.value = ""; // Clear input field value
    }
});
// Event listener for like buttons in search results
document.addEventListener("click", function(event) {
    const target = event.target;
    if (target.matches(".searchresult .like")) {
        const songName = target.parentElement.textContent.trim(); // Get the text content of the parent element (song name)
        likeSong(songName); // Call the function to like the song
        updateSongListUI(); // Update the song list UI to reflect changes
    }
});

// Function to like a song
function likeSong(songName) {
    const decodedSongName = decodeURIComponent(songName);
    const isLiked = likedSongs.includes(decodedSongName);
    if (!isLiked) {
        likedSongs.push(decodedSongName); // Add the song to the liked songs array
        console.log(`${decodedSongName} added to liked songs.`);
    }
}

// Function to update the song list UI
function updateSongListUI() {
    const songItems = document.querySelectorAll(".songlist li");
    songItems.forEach(item => {
        const songName = item.querySelector(".info div").textContent.trim();
        const isLiked = likedSongs.includes(songName);
        if (isLiked) {
            item.classList.add("liked"); // Mark the item as liked
            item.querySelector(".like").textContent = "Remove"; // Change the button text
        }
    });
}

