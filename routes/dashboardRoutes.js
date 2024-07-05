const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Customer = require('../models/customer');
const Sale = require('../models/sale');
const Certificate = require('../models/certificate');
const { authMiddleware } = require("../middleware/auth");


const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getFirstDayOfPreviousMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const getLastDayOfPreviousMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0);
};

router.use(authMiddleware(['MODERATOR', 'ADMIN']));

// Route pour obtenir les statistiques
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = getFirstDayOfMonth(now);
    const lastDayOfMonth = getLastDayOfMonth(now);
    const firstDayOfPreviousMonth = getFirstDayOfPreviousMonth(now);
    const lastDayOfPreviousMonth = getLastDayOfPreviousMonth(now);

    // Statistiques du mois en cours
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

    const previousTotalSales = await Sale.count({
        where: {
          realisedAt: {
            [Op.between]: [firstDayOfPreviousMonth, lastDayOfPreviousMonth]
          }
        }
    });

    // Calcul des taux d'évolution
    const calculateGrowthRate = (current, previous) => {
      if (previous === 0) {
        return current === 0 ? 0 : 100; // Si précédent est 0, le taux est 100%
      }
      return ((current - previous) / previous) * 100;
    };

    const salesGrowthRate = calculateGrowthRate(totalSales || 0, previousTotalSales || 0);

    const date = new Date().toLocaleTimeString("fr-FR") + ' - ' + new Date().toLocaleDateString("fr-FR");

    // Préparer la réponse
    const statistics = {
      totalRevenue: totalRevenue || 0, // Assurer que le total est 0 si aucune vente
      totalSales: totalSales || 0,
      totalCertificates: totalCertificates || 0,
      totalCustomers: totalCustomers || 0,
      evolution: salesGrowthRate.toFixed(),
      date: date,
    };

    res.json(statistics);

  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
});

module.exports = router;
