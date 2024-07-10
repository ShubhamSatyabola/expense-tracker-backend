const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema  = new Schema({
    payment_id:{
        type:String,
    },
    order_id:{
        type:String,
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

module.exports = mongoose.model("Order" , orderSchema)


// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const Order = sequelize.define('order',{
//     id: {
//         type:Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     payment_id: Sequelize.STRING,
//     order_id: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;