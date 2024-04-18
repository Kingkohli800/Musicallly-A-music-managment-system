const currentSong = new Audio();
let currFolder;
let songs = [];
let likedSongs = [];


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/public/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
            
            <img class="invert" src="music.svg" alt="music">
            <div class="info">
                <div>${song.replaceAll("http://127.0.0.1:5500/public/songs/", " ").replaceAll("%20", " ")} </div>
            </div>
            <button class="like"></button>
            
            <div class="playnow">
                <img class="invert" src="playnow.svg" alt="play">
            </div>
        </li>`;
    }
    Array.from(document.querySelectorAll(".like")).forEach((likeButton, index) => {
        likeButton.addEventListener("click", () => {
            // Get the song corresponding to the clicked like button
            const song = songs[index];
            // Check if the song is already liked
            const isLiked = likedSongs.includes(song);
            if (!isLiked) {
                // Add the song to the likedSongs array if it's not already there
                likedSongs.push(song);
                console.log(`${song} added to liked songs.`);
                // Add a class to mark the liked song
                likeButton.closest('li').classList.add('liked');
                // Replace the "Like" button with a "Remove" button
                likeButton.textContent = "Remove";
                likeButton.classList.remove("like");
                likeButton.classList.add("remove");
            } else {
                // If the song is already liked, remove it from the likedSongs array
                const songIndex = likedSongs.indexOf(song);
                likedSongs.splice(songIndex, 1);
                console.log(`${song} removed from liked songs.`);
                // Remove the class that marks the liked song
                likeButton.closest('li').classList.remove('liked');
                // Replace the "Remove" button with a "Like" button
                likeButton.textContent = "Like";
                likeButton.classList.remove("remove");
                likeButton.classList.add("like");
            }
        });
    });
    
    // Add event listener for the "Remove" button
    Array.from(document.querySelectorAll(".remove")).forEach((removeButton, index) => {
        removeButton.addEventListener("click", () => {
            // Get the song corresponding to the clicked remove button
            const song = songs[index];
            // Remove the song from the likedSongs array
            const songIndex = likedSongs.indexOf(song);
            likedSongs.splice(songIndex, 1);
            console.log(`${song} removed from liked songs.`);
            // Remove the class that marks the liked song
            removeButton.closest('li').classList.remove('liked');
            // Replace the "Remove" button with a "Like" button
            
            removeButton.textContent = "Like";
            removeButton.innerHTML = `<img src="bad-dislike-unlike-svgrepo-com.svg" alt="Like"> Like`; // Change inner HTML to Like button
            removeButton.classList.remove("remove");
            removeButton.classList.add("like");
        });
    });
     
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", event => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    })
    return songs;
}




function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



const playMusic = (track) => {
    currentSong.src = `/${currFolder}/` + track;

    // Add event listener for 'canplay' event
    currentSong.addEventListener('canplay', () => {
        // Play the audio when it's ready
        currentSong.play();
    }, { once: true }); // Ensure the event listener is removed after firing once

    jsmediatags.read(currentSong.src, {
        onSuccess: function (tag) {
            console.log(tag);
            // Access metadata properties
            console.log("Title:", tag.tags.title);
            console.log("Artist:", tag.tags.artist);
            console.log("Album:", tag.tags.album);
            console.log("Image:", tag.tags.picture);
            document.querySelector(".song-title").textContent = tag.tags.title;
            document.querySelector(".artist").textContent = tag.tags.artist;
            document.querySelector(".album").textContent = tag.tags.album;

            document.querySelector(".player h2").style.display = 'block';
            document.querySelector(".metadata-right h2").style.display = 'block';


            // You can access other metadata properties similarly
            document.querySelector(".songinfo").innerHTML = `${tag.tags.title} - ${tag.tags.artist}`;
            if (tag.tags.picture) {
                const base64String = arrayBufferToBase64(tag.tags.picture.data);
                document.querySelector(".song-image").src = `data:${tag.tags.picture.format};base64,${base64String}`;

            } else {
                // If no image found, set a default image
                document.querySelector(".song-image").src = "hollywood.jpg";
            }

        },
        onError: function (error) {
            console.log(':(', error.type, error.info);
        }
    });


    playsong.src = "pause.svg"
    document.querySelector(".duration").innerHTML = "00:00";
}

async function main() {

    
    
    
    currentSong.addEventListener("ended", () => {
        playNextSong();
    });

    // Function to play the next song
    function playNextSong() {
        const currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        const nextIndex = (currentIndex + 1) % songs.length; // Calculate next index with modulo operator
        playMusic(songs[nextIndex]);
    
    }



    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') { // Spacebar key
            event.preventDefault();
            togglePlayPause();
        }
    });
    
    function togglePlayPause() {
        if (currentSong.paused) {
            currentSong.play();
            playsong.src = "pause.svg";
        } else {
            currentSong.pause();
            playsong.src = "playnow.svg";
        }
    }
    
    document.querySelector("#playsong").addEventListener("click", togglePlayPause);
    
    //time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = secondsToMinutesSeconds(currentSong.currentTime) + " / " + secondsToMinutesSeconds(currentSong.duration);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    // Add an event listener to previous
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowLeft':
                playPreviousSong();
                break;
            case 'ArrowRight':
                playNextSong();
                break;
        }
    });
    
    
    function playPreviousSong() {
        const index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            // If there is a previous song in the playlist, play it
            playMusic(songs[index - 1]);
        } else {
            // If the current song is the first one, play the last song
            playMusic(songs[songs.length - 1]);
        }
    }
    
    function playNextSong() {
        const index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            // If there is a next song in the playlist, play it
            playMusic(songs[index + 1]);
        } else {
            // If the current song is the last one, play the first song
            playMusic(songs[0]);
        }
    }
    
    prev.addEventListener("click", playPreviousSong);
    next.addEventListener("click", playNextSong);
    




    // Add an event to volume
    document.addEventListener("keydown", (e) => {
        // Check if the pressed key is either '+' or '-'
        if (e.key === '+' || e.key === '-') {
            // Prevent the default behavior of the key to avoid unexpected scrolling or other actions
            e.preventDefault();
    
            // Get the current volume
            let currentVolume = currentSong.volume * 100;
    
            // If the pressed key is '+', increase the volume by 10%
            if (e.key === '+' && currentVolume < 100) {
                currentVolume += 10;
            }
            // If the pressed key is '-', decrease the volume by 10%
            else if (e.key === '-' && currentVolume > 0) {
                currentVolume -= 10;
            }
    
            // Update the volume
            currentSong.volume = currentVolume / 100;
            console.log("Setting volume to", currentVolume, "/ 100");
    
            // Update the volume icon if the volume is greater than 0
            if (currentVolume > 0) {
                document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("mute.svg", "volume.svg", " ");
            } else {
                // If volume is 0, change the icon to mute
                document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("volume.svg", "mute.svg", " ");
            }
    
            // Update the UI for volume control
            document.querySelector(".range input").value = currentVolume;
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


   
    var audio = new Audio(songs[0]);

    //load the playlist
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset)
            const songs = await getsong(`songs/${item.currentTarget.dataset.folder}`);


        });
    });


}


main();
//9IWm3KOn9YaBSK7T
//mongodb+srv://rahul:<password>y@rahul.czyc36l.mongodb.net/?retryWrites=true&w=majority&appName=rahul
