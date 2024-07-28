const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the notes.html page
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../notes.html'));
});

// Serve the index.html page for all other routes
router.get('/html', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = router;
