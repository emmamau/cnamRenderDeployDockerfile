const { v4: uuidv4 } = require ("uuid");
const { ACCESS_TOKEN_SECRET }  = require ("../config.js");

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  }

const db = require("../models");
const Utilisateur = db.utilisateur;
const Op = db.Sequelize.Op;

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  Utilisateur.findOne({ where: { login: utilisateur.login } })
    .then(data => {
      if (data) {
        const user = {
          id: data.id,
          name: data.nom,
          email: data.email
      };
      
      let accessToken = generateAccessToken(user);
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with login=${utilisateur.login}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Utilisateur with login=" + utilisateur.login
      });
    });
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.nom) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    const uuid = uuidv4 ();
    // Create a Utilisateur
    const utilisateur = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      login: req.body.login,
      email : req.body.email,
      id : uuid
    };
  
  
    const accessToken = generateAccessToken(utilisateur);

    console.log (accessToken)
    // Save Utilisateur in the database
    Utilisateur.create(utilisateur)
      .then(data => {
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Utilisateur."
        });
      });
  };

// Retrieve all Utilisateurs from the database.
exports.findAll = (req, res) => {
    const nom = req.query.nom;
    var condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null;
  
    console.log ("findAll")

    Utilisateur.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Utilisateur."
        });
      });
  };

// Find a single Utilisateur with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Utilisateur.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Utilisateur with id=" + id
      });
    });
};

// Update a Utilisateur by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Utilisateur.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Utilisateur with id=${id}. Maybe Utilisateur was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Utilisateur with id=" + id
      });
    });
};

// Delete a Utilisateur with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Utilisateur.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Utilisateur with id=" + id
      });
    });
};

// Delete all Utilisateur from the database.
exports.deleteAll = (req, res) => {
  Utilisateur.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Utilisateur were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Utilisateurs."
      });
    });
};

