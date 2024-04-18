// Event listener for keydown event on the file input
document.getElementById('mp3FileInput').addEventListener('keydown', async (e) => {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default behavior of the Enter key
        
        // Call the uploadFile function
        await uploadFile();
    }
});

// Function to upload file
async function uploadFile() {
    const formData = new FormData();
    const fileInput = document.getElementById('mp3FileInput');
    formData.append('mp3File', fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('File uploaded successfully');
            alert('File uploaded successfully!');
            // Clear the file input value after successful upload
            fileInput.value = '';
            // Call getsong function to refresh song list
            await getsong('songs'); 
        } else {
            console.error('Failed to upload file');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
