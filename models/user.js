const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true

  },
  name: Sequelize.STRING,
  email:{type: Sequelize.STRING,
    unique: true
},
    password:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN,
    totalexpense:Sequelize.STRING

 
});

module.exports = User;