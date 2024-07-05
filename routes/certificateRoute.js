const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { authMiddleware } = require("../middleware/auth");
router.use(authMiddleware(['MODERATOR', 'ADMIN']));

// Route pour générer un certificat d'authenticité
router.post("/generate", certificateController.generateCertificate);

// Route pour envoyer un certificat par email
router.post("/send", certificateController.sendCertificate);

module.exports = router;