const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transfer = sequelize.define('Transfer', {
  externalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  expectedOn: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  settlementReference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transfer_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Transfer;
