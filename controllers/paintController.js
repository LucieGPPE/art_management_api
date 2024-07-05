const {  Paint , Image} = require('../models');
const paintService = require('../services/paintService')


exports.findAllPaint = async (req, res) => {
  try {
    const paints = await paintService.findAllPaint();
    res.json(paints);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.findPaintById =  async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await paintService.findPaintById(id);
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }
    res.json(paint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


exports.addPaint =  async (req, res) => {
  try {
    
    const paint = await paintService.addPaint(req.body);


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
}

exports.updatePaint = async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await paintService.findPaintById(id);
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }

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

    await paint.update({
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
      await Image.destroy({ where: { paint_id: id } });

      const imageRecords = req.files.map((file) => ({
        name: file.originalname,
        path: file.path,
        paint_id: id,
      }));
      await Image.bulkCreate(imageRecords);
    }

    const updatedPaint = await Paint.findByPk(id, {
      include: [{ model: Image, as: "Images" }],
    });

    res.json(updatedPaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.deletePaint =  async (req, res) => {
  const { id } = req.params;
  try {
    const paint = await paintService.findPaintById(id);
    if (!paint) {
      return res.status(404).json({ error: "Peinture non trouvée" });
    }
    await paint.destroy();
    res.json({ message: "Peinture supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}