const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const fetch = require('node-fetch'); // Import the node-fetch module

const app = express();
const port = 3003;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Example user data (replace with your user data)
const users = [
  { id: 1, username: 'admin', password: 'admin' }
];

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);

    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'adlkhjasekklfj', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Admin route middleware
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.username === 'admin') {
    return next();
  }
  res.redirect('/admin/login');
};

// Index route to fetch data from API
app.get('/', async (req, res) => {
  try {
    // Replace the API URL with your actual API endpoint
    const apiUrl = 'https://www.elprisetjustnu.se/api/v1/prices/2024/02-13_SE3.json';
    
    const response = await fetch(apiUrl);
    const apiData = await response.json();

    res.render('index', { apiData });
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.render('index', { apiData: null });
  }
});

// Login and dashboard routes
app.get('/admin/login', (req, res) => {
  res.render('admin-login', { message: req.flash('error') });
});

app.post('/admin/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })
);

app.get('/admin/dashboard', isAdmin, (req, res) => {
  res.render('admin-dashboard', { user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
