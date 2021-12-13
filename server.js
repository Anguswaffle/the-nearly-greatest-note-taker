const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for notes API
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for note`);

  fs.readFile('./db/db.json', (err, data) => {
    if (err) console.error(err);
    else res.json(JSON.parse(data));
  })
    
});

// POST Route for notes API
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    notes.push(newNote)

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 3), (err) => err ? console.error(err) : console.info(`\nData written to db.json`))

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

// DELETE Route for notes API
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const deleteId = req.params.id;
  const newNotes = notes.filter(note => note.id !== deleteId)

  fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 3), (err) => err ? console.error(err) : console.info(`\nData written to db.json`))
  res.JSON(notes);
}) 

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);