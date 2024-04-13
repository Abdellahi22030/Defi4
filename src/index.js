const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.static('public'));
const { User, Candidate, Vote } = require('./config'); // Importation des modèles User, Candidate et Vote
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session
app.use(session({
  secret: '12345', // Clé secrète pour signer la session, changez-la selon vos besoins
  resave: false,
  saveUninitialized: true
}));
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    // L'utilisateur est authentifié, continuer
    next();
  } else {
    // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    res.redirect('/');
  }
};