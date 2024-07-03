const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Customer = require('../models/customer');
const Sale = require('../models/sale');
const Certificate = require('../models/certificate');

const getFirstDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};


// Route pour obtenir les statistiques
router.get("/", async (req, res) => {
  try {
    const firstDayOfMonth = getFirstDayOfMonth();
    const lastDayOfMonth = getLastDayOfMonth();

    const totalRevenue = await Sale.sum('amount', {
        where: {
          realisedAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth]
          },
          status: {
            [Op.or]: ['paid', 'pending'] // Inclure seulement les ventes payées ou en attente
          }
        }
    });

    const totalSales = await Sale.count({
        where: {
          realisedAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth]
          }
        }
    });

    const totalCertificates = await Certificate.count({
        where: {
          generatedAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth]
          }
        }
    });

    const totalCustomers = await Customer.count();

    const date = new Date().toLocaleTimeString("fr-FR") + ' - ' + new Date().toLocaleDateString("fr-FR");

    // Préparer la réponse
    const statistics = {
      totalRevenue: totalRevenue || 0, // Assurer que le total est 0 si aucune vente
      totalSales: totalSales || 0,
      totalCertificates: totalCertificates || 0,
      totalCustomers: totalCustomers || 0,
      date: date,
    };

    res.json(statistics);

  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
});

module.exports = router;