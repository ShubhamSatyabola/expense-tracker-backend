const User = require('../models/user');




exports.getPremium = async(req,res,next)=>{
    try{
        const leaderboarduser = await User.find().select("email totalExpense")

        console.log(leaderboarduser);
        res.status(200).json({leaderboarduser})
    
    }
    catch(err){
        console.log(err)
    }
}