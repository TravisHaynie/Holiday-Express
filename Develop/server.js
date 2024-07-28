const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: 'Note must have a title and text' });
    }

    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    const newNote = {
      id: (notes.length + 1).toString(),
      title,
      text
    };
    notes.push(newNote);

    await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2));
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id !== id);

    await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes, null, 2));
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});