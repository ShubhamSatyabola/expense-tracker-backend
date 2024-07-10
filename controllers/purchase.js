const Razorpay = require('razorpay');

const Order = require('../models/orders');

exports.purchasePremium = async (req,res,next) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.Razorpay_key_id,
            key_secret: process.env.Razorpay_key_secret
        })
        console.log(process.env.Razorpay_key_id);
        const amount = 2500

        await rzp.orders.create({amount, currency: "INR"}, async (err, order)=>{
            if (err){
                console.log(err);
            }
            const newOrder = new Order({order_id: order.id, status: "PENDING", userId:req.user._id})
            await newOrder.save();

            // await req.user.createOrder({order_id: order.id, status: "PENDING"})
            return res.status(201).json({newOrder, key_id: rzp.key_id})
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.updateTransactionStatus = async (req,res,next) => {
    try{
        const {payment_id,order_id,status,id} = req.body;
        
        if (status === 'FAILED'){
            const order = await Order.findByIdAndUpdate(
              { _id: id },
              { payment_id: payment_id, status: "Failed" }
            );
            
           
            return res.status(500).json({success:false, message:'Transaction failed'})
        }
        else{
             const order = await Order.findByIdAndUpdate(
               { _id: id },
               { payment_id: payment_id, status: "SUCCESSFUL" }
             );
             req.user.isPremiumUser = true
             await req.user.save()
            return res.status(200).json({success:true, message:'Transaction Successful' ,isPremiumUser:req.user.isPremiumUser})
       
        }
        
        

    }
    catch(err){
        console.log(err)
    }
}
