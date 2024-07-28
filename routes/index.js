const express = require('express'); // Importing Express framework
const path = require('path'); // Importing path module from Node.js
const router = express.Router(); // Creating a new router instance using Express

// Route to serve the notes.html page
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../notes.html')); // Sending notes.html file as response
});

// Route to serve the index.html page for all other routes
router.get('/html', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html')); // Sending index.html file as response
});

module.exports = router; // Exporting the router instance for use in other files
