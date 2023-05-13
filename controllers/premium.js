const User = require('../models/user');




exports.getPremium = async(req,res,next)=>{
    try{
        const leaderboarduser = await User.findAll({
            attributes:[ 'name','totalexpense'],
            
            order:[['totalexpense','DESC']]
        })
        res.status(200).json({leaderboarduser})
    
    }
    catch(err){
        console.log(err)
    }
}