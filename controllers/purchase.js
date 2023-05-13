const Razorpay = require('razorpay');

const Order = require('../models/orders');

exports.purchasePremium = async (req,res,next) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.Razorpay_key_id,
            key_secret: process.env.Razorpay_key_secret
        })
        const amount = 2500

        await rzp.orders.create({amount, currency: "INR"}, async (err, order)=>{
            if (err){
                throw new Error(JSON.stringify(err));

            }
            await req.user.createOrder({order_id: order.id, status: "PENDING"})
            return res.status(201).json({order, key_id: rzp.key_id})
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.updateTransactionStatus = async (req,res,next) => {
    try{
        const {payment_id,order_id,status} = req.body;
        const order = await Order.findOne({where:{order_id:order_id}})
        if (status === 'failed'){
            const promise1 = order.update({payment_id: payment_id, status:'Failed'})
            const promise2 = req.user.update({ispremiumuser:false})
            Promise.all([promise1,promise2]).then(()=>{
            return res.status(500).json({sucess:false, message:'Transaction failed'})
        })
        
        }
        else{
            const promise1 = order.update({payment_id: payment_id, status:'SUCCESSFUL'})
            const promise2 = req.user.update({ispremiumuser:true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({sucess:true, message:'Transaction Successful'})
        })
        }
        
        

    }
    catch(err){
        console.log(err)
    }
}
