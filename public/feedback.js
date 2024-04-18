function toggleFeedbackForm() {
    var popup = document.getElementById("popupFeedback");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        popup.style.display = "block";
    }
}

document.getElementById("popupFeedback").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    submitFeedback(); // Call function to submit feedback
});

function submitFeedback() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var feedback = document.getElementById("feedback").value;

    // AJAX request to submit feedback
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/submit_feedback", true); // Use the correct URL for your server
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Feedback submitted successfully
                alert("Feedback submitted successfully!");
                toggleFeedbackForm(); // Close the feedback form popup
            } else {
                // Error submitting feedback
                alert("Error submitting feedback. Please try again later.");
            }
        }
    };
    xhr.send("name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&feedback=" + encodeURIComponent(feedback));
}
