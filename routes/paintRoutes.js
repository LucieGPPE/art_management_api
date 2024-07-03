const express = require("express");
const router = express.Router();
const Paint = require("../models/paint");
const Image = require("../models/image");
const upload = require("../config/multer");

router.get("/", async (req, res) => {
  try {
    const paints = await Paint.findAll({
      include: {
        model: Image,
        attributes: ["name", "path"],
      },
    });
    res.json(paints);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await Paint.findByPk(id, {
      include: {
        model: Image,
        attributes: ["name", "path"],
      },
    });
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }
    res.json(paint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const {
      title,
      description,
      method,
      width,
      height,
      prize,
      quantity,
      createdAt,
    } = req.body;

    const paint = await Paint.create({
      title,
      description,
      method,
      width,
      height,
      prize,
      quantity,
      createdAt,
    });

    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file) => ({
        name: file.originalname,
        path: file.path,
        paint_id: paint.id,
      }));
      await Image.bulkCreate(imageRecords);
    }

    res.status(201).json(paint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await Paint.findByPk(id);
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }
    await paint.update(req.body);
    res.json(paint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await Paint.findByPk(id);
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }
    await paint.destroy();
    res.json({ message: "Peinture supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
