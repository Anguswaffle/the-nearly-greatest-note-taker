const express = require('express');
const path = require('path');
// const api = require('./routes/index.js');
const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');


const PORT = 3001;

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

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

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

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
}) 

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);