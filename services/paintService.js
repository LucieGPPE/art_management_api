const { Image, Paint } = require('../models');
const { Sequelize } = require('sequelize');

exports.findAllPaint = async () => {
    return await Paint.findAll({
        include: {
          model: Image,
          attributes: ["name", "path"],
        },
    });
}

exports.findPaintById = async (id) => {
    return await Paint.findByPk(id, {
        include: {
          model: Image,
          attributes: ["name", "path"],
        },
    });
}

exports.addPaint = async (data) => {
    const {
        title,
        description,
        method,
        width,
        height,
        prize,
        quantity,
        createdAt,
      } = data;

    return await Paint.create({
        title,
        description,
        method,
        width,
        height,
        prize,
        quantity,
        createdAt,
    });
}