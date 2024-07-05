const express = require("express");
const router = express.Router();
const Paint = require("../models/paint");
const Image = require("../models/image");
const upload = require("../config/multer");
const { authMiddleware } = require("../middleware/auth");
const paintController = require("../controllers/paintController")

// Utiliser le middleware d'authentification pour toutes les routes
router.use(authMiddleware(['MODERATOR', 'ADMIN']));

// Définir les routes CRUD pour les peintures
router.get("/", paintController.findAllPaint );

router.get("/:id", paintController.findPaintById);

router.post("/", upload.array("files", 10), paintController.addPaint);

router.put("/:id", upload.array("images", 10), paintController.updatePaint );

router.delete("/:id", paintController.deletePaint);

module.exports = router;
