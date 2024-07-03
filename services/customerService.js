const { Customer, Sale, Paint, Certificate } = require('../models');
const { Sequelize, Op } = require('sequelize');

exports.findAllCustomers = async () => {
  return await Customer.findAll({
    attributes: {
      include: [
        [
          Sequelize.fn("COUNT", Sequelize.col("Sales.id")),
          "paintingsPurchasedCount"
        ]
      ]
    },
    include: [
      {
        model: Sale,
        attributes: []
      }
    ],
    group: ['Customer.id']
  });
};

exports.findCustomerById = async (customerId) => {
  const customer = await Customer.findByPk(customerId, {
    include: [
      {
        model: Sale,
        include: [
          {
            model: Paint,
            attributes: ['id', 'title', 'description', 'artist', 'method', 'width', 'height', 'prize'],
            include: [
              {
                model: Certificate,
                attributes: ['id', 'generatedAt', 'linkPdf'],
              }
            ]
          }
        ],
        attributes: ['id', 'realisedAt', 'amount', 'status'],
      }
    ],
  });

  if (!customer) {
    throw new Error("Customer not found!");
  }

  const totalPaintings = await Sale.count({
    where: {
      customer_id: customerId,
    }
  });

  const totalCertificates = await Certificate.count({
    where: {
      customer_id: customerId,
    }
  });

  const totalSpent = await Sale.sum('amount', {
    where: {
      customer_id: customerId,
      status: {
        [Op.or]: ['paid', 'pending'],
      }
    }
  });

  return {
    customer,
    totalPaintings,
    totalCertificates,
    totalSpent,
  };
};

exports.createCustomer = async (customerData) => {
  console.log(customerData)
  return await Customer.create(customerData);
};

exports.deleteCustomer = async (customerId) => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new Error("Client non trouvé");
  }
  await customer.destroy();
};


exports.editCustomer =  async (req, res) => {
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
};