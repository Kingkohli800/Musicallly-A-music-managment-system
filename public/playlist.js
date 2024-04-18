const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'feedback' // Database name for feedback table
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/songs/uploadedsongs'; // Save files to public/songs/uploadedsongs directory
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname; // Get the original filename
        cb(null, originalName); // Use the original filename
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML page with upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('mp3File'), (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const uploadedFilePath = req.file.path;
        const filename = req.file.originalname;
        const fileSize = req.file.size;
        const ipAddress = req.ip; // Capture the IP address

        // Save file details to the database
        const sql = 'INSERT INTO uploaded_files (filename, path, size, ip_address) VALUES (?, ?, ?, ?)';
        connection.query(sql, [filename, uploadedFilePath, fileSize, ipAddress], (err, result) => {
            if (err) {
                console.error('Error saving file details to database:', err);
            } else {
                console.log('File details saved to database:', result);
            }
        });

        // Copy file to second location
        const secondLocation = 'public/songs/all/' + filename; // Define second location
        fs.copyFile(uploadedFilePath, secondLocation, (err) => {
            if (err) {
                console.error('Error copying file to second location:', err);
            } else {
                console.log('File copied to second location');
            }
        });

        console.log('File uploaded:', req.file.filename);
        res.send('File uploaded successfully!');
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send('Error uploading file');
    }
});

// Handle feedback submission
app.post('/submit_feedback', (req, res) => {
    const { name, email, feedback } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the pattern
    if (!emailPattern.test(email)) {
        console.error('Invalid email address:', email);
        return res.status(400).send('Invalid email address');
    }

    const sql = 'INSERT INTO feedback (name, email, feedback) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, feedback], (err, result) => {
        if (err) {
            console.error('Error submitting feedback:', err);
            res.status(500).send('Error submitting feedback');
        } else {
            console.log('Feedback submitted successfully');
            // Retrieve user's email from feedback
            sendFeedbackEmail(name, email, feedback);
            res.send('Feedback submitted successfully');
        }
    });
});

// Function to send email to user who submitted feedback
function sendFeedbackEmail(name, email, feedback) {
    // Prepare email content
    let mailOptions = {
        from: 'kanawader328@gmail.com', // Sender address
        to: email, // Receiver's email (the user who submitted feedback)
        subject: 'Thank you for your feedback', // Subject line
        text: `Hello ${name},\n\nThank you for your valuable feedback: ${feedback}\n\nBest regards,\nThe Musically Team` // Plain text body
    };

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        // Configure your SMTP settings here
        // For example, Gmail SMTP settings
        service: 'gmail',
        auth: {
            user: 'kanawader328@gmail.com', // Your Gmail address
            pass: 'ffoy htfh ccza shda' // Your Gmail password
        }
    });

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Serve static files from the public directory
app.use(express.static('public'));

// Handle song download
app.get('/download', (req, res) => {
    const { email, phone, songName } = req.query; // Destructuring assignment
    const ipAddress = req.ip; // Capture the IP address of the client

    // Check if email is provided
    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Send verification email
    const verificationLink = `https://yourwebsite.com/verify?email=${encodeURIComponent(email)}`;
    const mailOptions = {
        from: 'kanawader328@gmail.com',
        to: email,
        subject: 'Verify Your Email Address',
        html: `Click <a href="${verificationLink}">here</a> to verify your email address.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending verification email:', err);
            return res.status(500).send('Error sending verification email');
        }
        console.log('Verification email sent:', info.response);

        fs.readdir(path.join(__dirname, songsDirectory), (err, folders) => {
            if (err) {
                console.error('Error reading songs directory:', err);
                return res.status(500).send('Internal server error');
            }
    
            let songFound = false;
            let songPath;
    
            // Iterate through each folder to find the song
            folders.forEach(folder => {
                const folderPath = path.join(__dirname, songsDirectory, folder);
                const songPathInFolder = path.join(folderPath, songName);
                if (fs.existsSync(songPathInFolder)) {
                    songFound = true;
                    songPath = songPathInFolder;
                }
            });
    
            if (!songFound) {
                return res.status(404).send('Song not found');
            }
    
            // Store email, phone, song name, and IP address in the database
            const sql = 'INSERT INTO downloads (email, phone, song_name, ip_address) VALUES (?, ?, ?, ?)';
            connection.query(sql, [email, phone, songName, ipAddress], (err, result) => {
                if (err) {
                    console.error('Error storing download details:', err);
                } else {
                    console.log('Download details stored successfully');
                }
            });
    
            // Send the song file to the client for download
            res.download(songPath);
        });
     });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
