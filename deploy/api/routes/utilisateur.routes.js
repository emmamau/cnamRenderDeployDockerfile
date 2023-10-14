const { checkJwt}  = require('./jwtMiddleware');

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
  
    // Create a new utilisateur
    router.post("/", utilisateur.create);
  
    // Retrieve all utilisateur
    router.get("/", checkJwt,utilisateur.findAll);

    // login utilisateur
    router.post("/login", utilisateur.login);
  
    // Retrieve a single utilisateur with id
    router.get("/:id",checkJwt, utilisateur.findOne);
  
    // Update a utilisateur with id
    router.put("/:id", checkJwt, utilisateur.update);
  
    // Delete a utilisateur with id
    router.delete("/:id", checkJwt, utilisateur.delete);
  
    // Delete all utilisateur
    router.delete("/", checkJwt,utilisateur.deleteAll);
  
    app.use('/api/utilisateur', router);
  };
