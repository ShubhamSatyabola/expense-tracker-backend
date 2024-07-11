const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    id:{
        type: String,
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    isActive : {
        type : Boolean,
    }
})

module.exports = mongoose.model("ForgotPassword" , forgotPasswordSchema)


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const ForgotPass = sequelize.define('forgotPass',{
//     id:{type:Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true
//     },
//     isactive: Sequelize.BOOLEAN
// })
// module.exports = ForgotPass ;