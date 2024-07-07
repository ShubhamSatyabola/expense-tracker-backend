const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isPremiumUser : {
        type : Boolean,
        default : false
    },
    totalExpense : {
        type : Number,
        default : 0
    }
})

module.exports = mongoose.model("User" , userSchema)




// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true

//   },
//   name: Sequelize.STRING,
//   email:{type: Sequelize.STRING,
//     unique: true
// },
//     password:Sequelize.STRING,
//     ispremiumuser:Sequelize.BOOLEAN,
//     totalexpense:Sequelize.STRING

 
// });

// module.exports = User;