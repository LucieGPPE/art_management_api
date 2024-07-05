const Certificate = require("../models/certificate");
const Paint = require("../models/paint");
const Customer = require("../models/customer");
const Jimp = require("jimp");

const TEMPLATE_CERTIFICATE = "./templates/cert.png";
const OUTPUT_CERTIFICATE = "./certificates";
const X_POSITION = 90;
const MAX_WIDTH = 500;

exports.generateCertificate = async (req, res) => {
  try {
    const { paint_id, customer_id } = req.body;

    const paint = await Paint.findByPk(paint_id);
    const customer = await Customer.findByPk(customer_id);
    if (!paint || !customer) {
      return res.status(404).json({ error: "Peinture ou client non trouvé" });
    }

    const generatedAt = new Date();
    const linkPdf = `${OUTPUT_CERTIFICATE}/${paint_id}-${customer_id}.png`;

    await writeTextOnImage(
      TEMPLATE_CERTIFICATE,
      linkPdf,
      paint.title,
      paint.artist,
      `${paint.width}x${paint.height}`,
      new Date(paint.createdAt).toLocaleDateString('fr-FR'),
      paint.method
    );

    const certificate = await Certificate.create({
      paint_id,
      customer_id,
      generatedAt,
      linkPdf,
    });

    res.status(201).json(linkPdf);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.sendCertificate = async (req, res) => {
  try {
    const { paint_id, customer_id } = req.body;

    const paint = await Paint.findByPk(paint_id);
    const customer = await Customer.findByPk(customer_id);
    if (!paint || !customer) {
      return res.status(404).json({ error: "Peinture ou client non trouvé" });
    }

    // Simulation envoi de mail
    const emailContent = `Bonjour ${customer.firstname} ${customer.lastname},\n\nVoici votre certificat d'authenticité pour la peinture "${paint.title}".\n\nCordialement,\nVotre galerie d'art`;

    console.log("Envoi du certificat par email :");
    console.log(emailContent);

    res.status(201).json({ message: "Certificat envoyé par email" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

async function writeTextOnImage(
  imagePath,
  outputImagePath,
  title,
  artist,
  dimensions,
  creationDate,
  method
) {
  try {
    const image = await Jimp.read(imagePath);

    // Définir les propriétés du texte
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const textOptions = {
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };

    // Positionnement du texte
    const textPositions = [
      { text: `Titre : ${title}`, x: X_POSITION, y: 185 },
      { text: `Artiste : ${artist}`, x: X_POSITION, y: 220 },
      { text: `Dimensions : ${dimensions}`, x: X_POSITION, y: 255 },
      { text: `Date de création : ${creationDate}`, x: X_POSITION, y: 290 },
      { text: `Méthode : ${method}`, x: X_POSITION, y: 325 },
    ];

    // Écrire le texte sur l'image
    for (const { text, x, y } of textPositions) {
      image.print(font, x, y, text, MAX_WIDTH);
    }

    // Sauvegarder l'image modifiée
    await image.writeAsync(outputImagePath);
    console.log(`L'image avec texte a été sauvegardée à : ${outputImagePath}`);
  } catch (error) {
    console.error("Erreur lors de l'écriture sur l'image :", error);
  }
}
