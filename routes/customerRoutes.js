const express = require("express");
const router = express.Router();
const { Customer } = require("../models");

//Afficher tous les clients
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Afficher un client par ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found !" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ajouter un client
router.post("/", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modifier un client
router.put("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    await customer.update(req.body);
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un client
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    await customer.destroy();
    res.json({ message: "Client supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
