const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs'); // Import EJS for templating

const app = express();
const port = 3000; // Port to listen on

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the default templating engine
app.set('view engine', 'ejs');

// Set the directory for views (optional, adjust if needed)
app.set('views', path.join(__dirname, 'views'));

// Routes (replace with your actual logic)
app.get('/', (req, res) => {
  // Logic to get all potions and render the list view
  res.render('index', { potions: [] }); // Replace with your potion data
});

app.get('/potions/:id', (req, res) => {
  // Logic to get a specific potion by ID and render details view
  res.render('potionDetails', { potion: {} }); // Replace with your potion data
});

app.post('/potions', (req, res) => {
  // Logic to handle adding a new potion (for educational purposes only)
  res.send('Potion added successfully!'); // Replace with proper logic
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
