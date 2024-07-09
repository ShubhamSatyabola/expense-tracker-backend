const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async(req,res,next)=>{
    try{const token = req.header("Authorization")
    // console.log("token" ,token)
    const id = jwt.verify(token, process.env.token)
    // console.log(id)
    const user = await User.findById(id.userId)
    if(user){
         req.user = user;
         next();
    }
   
    }
    catch(err){
        console.log(err)
    }
}
 