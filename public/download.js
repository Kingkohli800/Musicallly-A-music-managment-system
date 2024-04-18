// Add an event listener to the download button
document.querySelector(".download-button").addEventListener("click", () => {
    // Prompt the user to enter their email ID
    const email = prompt("Please enter your email:");

    // Check if email is provided
    if (email) {
        // Validate the email address using a regular expression
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email address. Please provide a valid email address.");
            return; // Exit the function if the email is invalid
        }

        const currentSongName = getCurrentSongName(); // Function to get the name of the currently playing song
        downloadSong(currentSongName, email); // Function to initiate the download
    } else {
        alert("Please provide an email address to proceed with the download.");
    }
});

// Function to get the name of the currently playing song
function getCurrentSongName() {
    // Extract the filename from the src of the current song
    return currentSong.src.split('/').pop();
}

// Function to initiate the download of the song
function downloadSong(songName, email, phoneNumber) {
    // Construct the URL of the song download endpoint
    const downloadEndpoint = '/download';

    // Construct the URL of the song
    const songUrl = `/${currFolder}/${songName}`;

    // Append email and phone number as query parameters to the download link
    const downloadUrl = `${downloadEndpoint}?songName=${encodeURIComponent(songName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phoneNumber)}`;

    // Create a temporary anchor element to trigger the download
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    tempLink.download = songName; // Set the filename for the downloaded file

    // Programmatically trigger a click on the anchor element to initiate the download
    tempLink.click();
}
