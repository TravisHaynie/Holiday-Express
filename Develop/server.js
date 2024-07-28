const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static('public')); // Middleware to serve static files from 'public' directory

// Route to get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8'); // Read data from file
    res.json(JSON.parse(data)); // Send JSON response with parsed data
  } catch (err) {
    res.status(500).json({ error: 'Failed to read notes' }); // Error handling for file read failure
  }
});

// Route to add a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, text } = req.body; // Extract title and text from request body
    if (!title || !text) {
      return res.status(400).json({ error: 'Note must have a title and text' }); // Validate input fields
    }

    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8'); // Read existing data
    const notes = JSON.parse(data); // Parse existing notes
    const newNote = {
      id: (notes.length + 1).toString(), // Generate new ID
      title,
      text
    };
    notes.push(newNote); // Add new note to array

    await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2)); // Write updated data to file
    res.json(newNote); // Respond with newly created note
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' }); // Error handling for file write failure
  }
});

// Route to delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract note ID from request parameters
    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8'); // Read current notes data
    const notes = JSON.parse(data); // Parse notes data into array
    const filteredNotes = notes.filter(note => note.id !== id); // Filter out the note with matching ID

    await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes, null, 2)); // Write updated notes to file
    res.json({ message: 'Note deleted' }); // Respond with success message
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' }); // Error handling for file write failure
  }
});

// Route to serve the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html')); // Send notes.html file
});

// Route to serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html')); // Send index.html file for any other route
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Start server and log listening port
});
