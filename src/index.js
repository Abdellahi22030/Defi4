const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
app.use(express.static('public'));
const { Equipe, Utilisateur, Challenge, Evaluation, Statistiques } = require('./config'); // Importation des modèles
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session
app.use(session({
  secret: '12345', // Clé secrète pour signer la session, changez-la selon vos besoins
  resave: false,
  saveUninitialized: true
}));


// Middleware pour vérifier l'authentification
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    // L'utilisateur est authentifié, continuer
    next();
  } else {
    // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    res.redirect('/');
  }
};

// Routes pour manipuler les données des équipes

// Obtention de toutes les équipes
app.get('/equipes', requireLogin, async (req, res) => {
  try {
    const equipes = await Equipe.find();
    res.json(equipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Création d'une nouvelle équipe
app.post('/equipes', requireLogin, async (req, res) => {
  const equipe = new Equipe({
    ID_de_l_equipe: req.body.ID_de_l_equipe,
    Nom_de_l_equipe: req.body.Nom_de_l_equipe,
    Logo_de_l_equipe: req.body.Logo_de_l_equipe
  });

  try {
    const newEquipe = await equipe.save();
    res.status(201).json(newEquipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes pour manipuler les données des utilisateurs

// Obtention de tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Route pour la racine de l'application
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil');
});


// Création d'un nouvel utilisateur
app.post('/utilisateurs', async (req, res) => {
  const utilisateur = new Utilisateur({
    ID_de_l_utilisateur: req.body.ID_de_l_utilisateur,
    Nom_d_utilisateur: req.body.Nom_d_utilisateur,
    Mot_de_passe: req.body.Mot_de_passe,
    Adresse_e_mail: req.body.Adresse_e_mail,
    Role: req.body.Role
  });

  try {
    const newUtilisateur = await utilisateur.save();
    res.status(201).json(newUtilisateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes pour manipuler les données des défis

// Obtention de tous les défis
app.get('/defis',  async (req, res) => {
  try {
    const defis = await Challenge.find();
    res.json(defis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Création d'un nouveau défi
app.post('/defis', requireLogin, async (req, res) => {
  const defi = new Challenge({
    ID_du_defi: req.body.ID_du_defi,
    Titre_du_defi: req.body.Titre_du_defi,
    Description_du_defi: req.body.Description_du_defi,
    Date_de_debut: req.body.Date_de_debut,
    Date_de_fin: req.body.Date_de_fin
  });

  try {
    const newDefi = await defi.save();
    res.status(201).json(newDefi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes pour manipuler les données des évaluations

// Obtention de toutes les évaluations
app.get('/evaluations', requireLogin, async (req, res) => {
  try {
    const evaluations = await Evaluation.find();
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Création d'une nouvelle évaluation
app.post('/evaluations', requireLogin, async (req, res) => {
  const evaluation = new Evaluation({
    ID_de_l_evaluation: req.body.ID_de_l_evaluation,
    ID_de_l_equipe_evaluee: req.body.ID_de_l_equipe_evaluee,
    ID_du_defi_evalue: req.body.ID_du_defi_evalue,
    Note_attribuee: req.body.Note_attribuee,
    Commentaires: req.body.Commentaires
  });

  try {
    const newEvaluation = await evaluation.save();
    res.status(201).json(newEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes pour manipuler les données des statistiques

// Obtention de toutes les statistiques
app.get('/statistiques', requireLogin, async (req, res) => {
  try {
    const statistiques = await Statistiques.find();
    res.json(statistiques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Création de nouvelles statistiques
app.post('/statistiques', requireLogin, async (req, res) => {
  const statistiques = new Statistiques({
    ID_de_la_statistique: req.body.ID_de_la_statistique,
    Nombre_d_equipes_participantes: req.body.Nombre_d_equipes_participantes,
    Score_total_de_chaque_equipe: req.body.Score_total_de_chaque_equipe
  });

  try {
    const newStatistiques = await statistiques.save();
    res.status(201).json(newStatistiques);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route pour la connexion utilisateur
app.post('/connexion', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Recherche de l'utilisateur dans la base de données
    const user = await Utilisateur.findOne({ Nom_d_utilisateur: username });

    // Vérification si l'utilisateur existe et si le mot de passe est correct
    if (!user || user.Mot_de_passe !== password) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Connexion réussie
    req.session.user = user; // Stockez l'utilisateur dans la session

    // Redirection en fonction du rôle de l'utilisateur
    if (user.Role === 'Admin') {
      res.json({ message: 'Connexion réussie en tant qu\'administrateur' });
    } else if (user.Role === 'Jury') {
      res.json({ message: 'Connexion réussie en tant que jury' });
    } else if (user.Role === 'Participant') {
      res.json({ message: 'Connexion réussie en tant que participant' });
      
    } else {
      res.json({ message: 'Rôle utilisateur non reconnu' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/utilisateurs/:id', async (req, res) => {
  const userId = req.params.id;
  const { Nom_d_utilisateur, Mot_de_passe, Adresse_e_mail, Role } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les champs de l'utilisateur
    user.Nom_d_utilisateur = Nom_d_utilisateur;
    user.Mot_de_passe = Mot_de_passe;
    user.Adresse_e_mail = Adresse_e_mail;
    user.Role = Role;

    // Enregistrer les modifications
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.listen(8080, () => console.log('Serveur démarré sur le port 3004'));
