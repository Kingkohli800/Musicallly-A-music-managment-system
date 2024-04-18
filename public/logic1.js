// logic.js

document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    // Your code to handle form submission (e.g., fetching/uploading files)
});


document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("createPlaylistForm");
    const cardContainer = document.querySelector(".playlist");

    // Load existing playlists from local storage
    loadPlaylists();

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const newPlaylistName = document.getElementById("newPlaylistName").value;
        if (newPlaylistName.trim() === "") {
            alert("Please enter a valid playlist name.");
            return;
        }

        const newPlaylistCard = createPlaylistCard(newPlaylistName);

        // Find the reference card
        const referenceCard = document.querySelector(".card:nth-last-child(2)");
        if (referenceCard) {
            cardContainer.insertBefore(newPlaylistCard, referenceCard.nextSibling);
        } else {
            cardContainer.appendChild(newPlaylistCard); // If there are no existing cards, simply append the new one
        }

        // Save the playlist to local storage
        savePlaylist(newPlaylistName);

        // Apply CSS to the newly created card
        applyNewCardStyle(newPlaylistCard);

        // Reset the input field
        document.getElementById("newPlaylistName").value = "";
    });

    function createPlaylistCard(name) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.folder = name;
        
        // Play button
        const playButton = document.createElement("div");
        playButton.classList.add("play");
        playButton.innerHTML = `
        <svg height="38px" width="38px" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
        <circle fill="#3e5bc1" cx="29" cy="29" r="29"/>
        <polygon fill="#FFFFFF" points="44,29 22,44 22,29.273 22,14"/>
        <path fill="#FFFFFF" d="M22,45c-0.16,0-0.321-0.038-0.467-0.116C21.205,44.711,21,44.371,21,44V14c0-0.371,0.205-0.711,0.533-0.884c0.328-0.174,0.724-0.15,1.031,0.058l22,15C44.836,28.36,45,28.669,45,29s-0.164,0.64-0.437,0.826l-22,15C22.394,44.941,22.197,45,22,45zM23,15.893v26.215L42.225,29L23,15.893z"/>
        </svg>`;

        const img = document.createElement("img");
        img.classList.add("rounded");
        img.src = "image.png"; // Set default image source
        img.alt = name;

        const title = document.createElement("h3");
        title.textContent = name;

        const description = document.createElement("p");
        description.textContent = "Enjoy your music without interruption";

        // Delete button for all users
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function() {
            // Remove the playlist card from the DOM
            card.remove();
            // Remove the playlist from local storage
            deletePlaylist(name);
        });

        card.appendChild(playButton);
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(deleteButton);

        return card;
    }

    function savePlaylist(playlistName) {
        // Retrieve existing playlists from local storage
        let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

        // Add the new playlist to the list
        playlists.push({ name: playlistName });

        // Save the updated playlists back to local storage
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }

    function deletePlaylist(playlistName) {
        // Retrieve existing playlists from local storage
        let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

        // Find and remove the playlist from the list
        const index = playlists.findIndex(playlist => playlist.name === playlistName);
        if (index !== -1) {
            playlists.splice(index, 1);
        }

        // Save the updated playlists back to local storage
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }

    function loadPlaylists() {
        let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

        // Create playlist cards for each playlist
        playlists.forEach(function(playlist) {
            const playlistCard = createPlaylistCard(playlist.name);
            cardContainer.appendChild(playlistCard);
        });
    }

    function applyNewCardStyle(card) {
        card.classList.add("newly-created-card");
    }
});
