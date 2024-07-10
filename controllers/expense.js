const Userservice = require('../service/userservice')
const S3service = require('../service/s3')
const mongoose = require("mongoose")
const Expense = require('../models/expense');
// const sequelize = require('../util/database');
exports.getExpense = async (req, res, next) => {
   try{
      try {
        const check = req.user.isPremiumUser;
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 10;

        // Calculate the total number of expenses for the user
        const totalExpense = await Expense.countDocuments({
          userId: req.user._id,
        });
        console.log(totalExpense , " total expense");
        // Fetch the expenses with pagination and sorting
        const expenses = await Expense.find({ userId: req.user._id })
          .sort({ _id: -1 }) // Sort by id in descending order
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        // console.log("expenses",expenses);
        res.status(200).json({
          allExpense: expenses,
          totalExpense,
          totalExpense:req.user.totalExpense,
          totalIncome:req.user.totalIncome

        //   check,
        //   currentPage: page,
        //   hasNextPage: pageSize * page < totalExpense,
        //   nextPage: page + 1,
        //   hasPreviousPage: page > 1,
        //   previousPage: page - 1,
        //   lastPage: Math.ceil(totalExpense / pageSize),
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
      }

    // const check = req.user.ispremiumuser
    // const page = +req.query.page || 1
    // const pageSize =  +req.query.pageSize || 10
    // let totalExpense=await req.user.countExpenses();
    // //console.log(totalExpense)
    
    // const data = await Userservice.getExpenses(req,
    //     {offset:(page-1)*pageSize,limit:pageSize,
    //     order:[['id','DESC']]
    // })
    // //console.log(data)
    
    // res.status(200).json({
    //     allExpense: data ,
    //     check,
    //     currentPage:page,
    //     hasNextPage:pageSize*page < totalExpense,
    //     nextPage: page+1,
    //     hasPreviousPage:page>1,
    //     previousPage:page-1,
    //     lastPage:Math.ceil(totalExpense/pageSize)
        
    //     })
}catch(err){
    console.log(err)
}
}
exports.postExpense = async (req, res, next) => {
//   const session = await mongoose.startSession();
  try {
    // session.startTransaction();

    const { amount, description, category , add} = req.body;

    if (!amount || !description) {
    //   await session.abortTransaction();
    //   session.endSession();
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(amount) || amount <= 0) {
    //   await session.abortTransaction();
    //   session.endSession();
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }
    console.log(req.user.totalExpense);
    
  
    const expense = new Expense({
      amount,
      description,
      category,
      userId: req.user._id,
      add
    });
    await expense.save() ;
    if(add == "true"){
         req.user.totalIncome = +req.user.totalIncome + +amount;
        
    }
    else{
         req.user.totalExpense = +req.user.totalExpense +  +amount;
    }
  
    await req.user.save() ;

    // await Promise.all([expense.save({ session }), req.user.save({ session })]);

    // await session.commitTransaction();
    // session.endSession();
    console.log("post done")
    res.status(200).json({ expenseDetail: expense });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
// exports.postExpense = async (req, res, next) => {
//     try{
//     const t = await sequelize.transaction()
//     const amount = req.body.amount;
//     const description = req.body.description;
//     const category = req.body.category;
//     //const expense = await Expense.create({amount: amount,description: description, category: category,userId:req.user.id})
//     if(amount===undefined || amount.length===0 || description===undefined || description.length===0){
//         return res.status(400).json({error:'all fields required'})
//     }
    
        
//         const totalExpense = +req.user.totalexpense + +amount
//         const expense =  req.user.createExpense({
//             amount: amount,
//             description: description,
//             category: category
//         },{transaction: t})
//         const promise1 = req.user.update({totalexpense:totalExpense},{transaction:t})
//         Promise.all([expense,promise1])
//         .then(async (response)=>{
//             await t.commit()
//             res.status(200).json({expenseDetail: response})
//         })
//         .catch(async(err)=>{
//             await t.rollback()
//             console.log(err)
//         })   
    
// }
// catch(err){
//     await t.rollback()
//     console.log(err)
// }
   
// }
exports.deleteExpense = async(req, res, next) => {
    try {
        const id = req.params.expenseId
        const expense = await Expense.findByIdAndDelete(id);
        if(expense.add ==  "true"){
            req.user.totalIncome = +req.user.totalIncome - +expense.amount
        }
        else{
            req.user.totalExpense = +req.user.totalExpense - +expense.amount
        }
        await req.user.save()
       
        
        res.status(200).json({message: "deleted successfully",id:expense._id})
    }
        catch(err){
        console.log(err);
        res.status(500).json("something went wrong")};
}

// exports.downloadReport = async (req,res,next)=>{
//     try{
//         if(req.user.ispremiumuser===true){
//             const expenses = await req.user.getExpenses();
//             //console.log(expenses)
//             const stringifiedExpenses = JSON.stringify(expenses);
//             const userId = req.user.id
//             const filename = `Expense${userId}/${new Date()}.txt`
            
//             const fileURl = await S3service.uploadToS3(stringifiedExpenses, filename)
//             //console.log(fileURl)
//             await req.user.createDownloadreport({URL:fileURl})
//             res.status(200).json({fileURl, success: true})
//         }
//         else{
//             return res.status(400).json({error:'not a premium user'})
//         }

//     }
//     catch(err){
//         console.log(err)
//         res.status(400).json({error:err})
//     }
// }
