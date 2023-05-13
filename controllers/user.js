const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



function generateToken(id){
 return jwt.sign({userId: id}, process.env.token)
}

exports.postSignUp = async (req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findAll({where:{email:email}});
        if(user.length>0){
            //console.log(user)
           return res.status(500).json({error: "email already exist"})
        }
        const saltRounds = 10;
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
                console.log(err)
                const newUser = await User.create({
                    name: name,
                    email: email,
                    password: hash
                })
                res.status(201).json({newUser: "signed up" })
            
        })
        
        

     }
    catch(err){
        //console.log(err)
        res.status(500).json({error:err})
    }
}

exports.getSignUp = async (req,res)=>{
    try{const allUsers = await User.findAll();
        res.status(200).json({allUsers: allUsers})

    }
    catch(err){
        console.log(err)
    }
}

exports.postLogIn = async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;



        const user = await User.findAll({where:{email:email}});
        //console.log(user)
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    return res.status(500).json({success:true , error: "Something Went Wrong"})
                }
                if(result == true){
                    return res.status(201).json({message: "user logged in sucessfully",
                    token: generateToken(user[0].id) })
                }
                else{
                    return res.status(401).json({error: "incorrect password" })
                  }
            })
            // if(user[0].password === password){

            // }
             
            
            
        }
        else{
            res.status(404).json({error:"user not found"})
        }
        
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

