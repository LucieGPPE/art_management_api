const { Customer, Sale, Paint, Certificate } = require('../models');
const { Sequelize, Op, ValidationError, UniqueConstraintError   } = require('sequelize');
const customerService = require('../services/customerService');

exports.findAllCustomer = async (req,res)=>{
    try {
        const customers = await customerService.findAllCustomers();
        res.json(customers);
    } catch (error) {
        next(error);
    }
}

exports.findCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customerData = await customerService.findCustomerById(customerId);
        res.json(customerData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addCustomer = async (req, res) => {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      
  
      if (error instanceof UniqueConstraintError) {
        const errors = error.errors.map((e) => ({
          message: `The email ${e.value} is already in use.`,
          field: e.path,
          value: e.value,
        }));
        return res.status(400).json({ error: errors[0].message });
      }
  
      if (error instanceof ValidationError) {
        const errors = error.errors.map((e) => ({
          message: e.message,
          field: e.path,
          value: e.value,
        }));
        return res.status(400).json({ error: "Validation error", details: errors });
      }

      res.status(400).json({ error: error.message });
    }
  };
  

exports.editCustomerById = async (req, res) => {
    try {
        const customer = await customerService.editCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await customerService.deleteCustomer(customerId);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }}