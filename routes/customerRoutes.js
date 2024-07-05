const express = require("express");
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const Customer = require("../models/customer");
const Sale = require("../models/sale");
const Paint = require("../models/paint");
const Certificate = require("../models/certificate");
const { authMiddleware } = require("../middleware/auth");
const customerController = require("../controllers/customerController")

router.use(authMiddleware(['MODERATOR', 'ADMIN']));

// Afficher tous les clients
router.get("/", customerController.findAllCustomer);

// Afficher un client par ID
router.get("/:id", customerController.findCustomerById );

// Ajouter un client
router.post("/", customerController.addCustomer);

// Modifier un client
router.put("/:id", customerController.editCustomerById);

// Supprimer un client
router.delete("/:id", customerController.deleteCustomerById );

module.exports = router;
