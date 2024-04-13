const mongo = require('mongoose');

// Connexion à la base de données
connect = mongo.connect('mongodb://localhost:27017/defi4')
connect.then(() => {
  console.log("La connexion à la base de données est un succès");
});

// Définition du modèle Equipe
const equipeSchema = new mongo.Schema({
  ID_de_l_equipe: { type: Number, required: true },
  Nom_de_l_equipe: { type: String, required: true },
  Composition_de_l_equipe: { type: [String], required: true },
  Slogan_de_l_equipe: { type: String },
  Logo_de_l_equipe: { type: String } 
}, { collection: 'Equipe' });

const Equipe = mongo.model('Equipe', equipeSchema);

// Définition du modèle Utilisateur
const utilisateurSchema = new mongo.Schema({
  ID_de_l_utilisateur: { type: Number, required: true },
  Nom_d_utilisateur: { type: String, required: true },
  Mot_de_passe: { type: String, required: true },
  Adresse_e_mail: { type: String, required: true, unique: true },
  Role: { type: String, required: true }
}, { collection: 'Utilisateur' });

const Utilisateur = mongo.model('Utilisateur', utilisateurSchema);

// Définition du modèle Challenge
const challengeSchema = new mongo.Schema({
  ID_du_defi: { type: Number, required: true },
  Titre_du_defi: { type: String, required: true },
  Description_du_defi: { type: String, required: true },
  Date_de_debut: { type: Date, required: true },
  Date_de_fin: { type: Date, required: true },
  Grille_d_evaluation_associee: { type: String } // Peut-être un ID de la grille d'évaluation
}, { collection: 'Challenge' });

const Challenge = mongo.model('Challenge', challengeSchema);

// Définition du modèle Evaluation
const evaluationSchema = new mongo.Schema({
  ID_de_l_evaluation: { type: Number, required: true },
  ID_de_l_equipe_evaluee: { type: Number, required: true },
  ID_du_defi_evalue: { type: Number, required: true },
  Note_attribuee: { type: Number, required: true },
  Commentaires: { type: String }
}, { collection: 'Evaluation' });

const Evaluation = mongo.model('Evaluation', evaluationSchema);

// Définition du modèle Statistique
const statistiqueSchema = new mongo.Schema({
  ID_de_la_statistique: { type: Number, required: true },
  Nombre_d_equipes_participantes: { type: Number, required: true },
  Score_total_de_chaque_equipe: { type: Object },
  Autres_statistiques_pertinentes: { type: String }
}, { collection: 'Statistique' });

const Statistique = mongo.model('Statistique', statistiqueSchema);

// Exportation des modèles
module.exports = { Equipe, Utilisateur, Challenge, Evaluation, Statistique };
