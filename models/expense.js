const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  add:{
    type:String,
   
  },
 
});

module.exports = mongoose.model("Expense", expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense',{
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true

//   },
//   amount: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {type: Sequelize.STRING,

//   },
//   category: {
//     type: Sequelize.STRING,

//   }

// });

// module.exports = Expense;
