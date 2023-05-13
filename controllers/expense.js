const Userservice = require('../service/userservice')
const S3service = require('../service/s3')

const Expense = require('../models/expense');
const sequelize = require('../util/database');
exports.getExpense = async (req, res, next) => {
   try{
    const check = req.user.ispremiumuser
    const page = +req.query.page || 1
    const pageSize =  +req.query.pageSize || 10
    let totalExpense=await req.user.countExpenses();
    //console.log(totalExpense)
    
    const data = await Userservice.getExpenses(req,
        {offset:(page-1)*pageSize,limit:pageSize,
        order:[['id','DESC']]
    })
    //console.log(data)
    
    res.status(200).json({
        allExpense: data ,
        check,
        currentPage:page,
        hasNextPage:pageSize*page < totalExpense,
        nextPage: page+1,
        hasPreviousPage:page>1,
        previousPage:page-1,
        lastPage:Math.ceil(totalExpense/pageSize)
        
        })
}catch(err){
    console.log(err)
}
}
exports.postExpense = async (req, res, next) => {
    try{
    const t = await sequelize.transaction()
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    //const expense = await Expense.create({amount: amount,description: description, category: category,userId:req.user.id})
    if(amount===undefined || amount.length===0 || description===undefined || description.length===0){
        return res.status(400).json({error:'all fields required'})
    }
    
        
        const totalExpense = +req.user.totalexpense + +amount
        const expense =  req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        },{transaction: t})
        const promise1 = req.user.update({totalexpense:totalExpense},{transaction:t})
        Promise.all([expense,promise1])
        .then(async (response)=>{
            await t.commit()
            res.status(200).json({expenseDetail: response})
        })
        .catch(async(err)=>{
            await t.rollback()
            console.log(err)
        })   
    
}
catch(err){
    await t.rollback()
    console.log(err)
}
   
}
exports.deleteExpense = async(req, res, next) => {
    try {const id = req.params.expenseId

        const t = await sequelize.transaction()
        
        const expense = await Expense.findByPk(id);
        const totalExpense = +req.user.totalexpense - +expense.amount
        const promise1 = req.user.update({totalexpense: totalExpense},{transaction:t})
        const promise2 = expense.destroy({where:{userId:req.user.id},transaction:t});
        Promise.all([promise1,promise2])
        .then(async(response)=>{
            await t.commit()
            res.status(200).json({message: "deleted successfully"})
        })
        .catch(async(err)=>{
            await t.rollback()
            console.log(err)})
        }
        catch(err){
        await t.rollback()
        console.log(err)
        res.status(500).json("something went wrong")};
}

exports.downloadReport = async (req,res,next)=>{
    try{
        if(req.user.ispremiumuser===true){
            const expenses = await req.user.getExpenses();
            //console.log(expenses)
            const stringifiedExpenses = JSON.stringify(expenses);
            const userId = req.user.id
            const filename = `Expense${userId}/${new Date()}.txt`
            
            const fileURl = await S3service.uploadToS3(stringifiedExpenses, filename)
            //console.log(fileURl)
            await req.user.createDownloadreport({URL:fileURl})
            res.status(200).json({fileURl, success: true})
        }
        else{
            return res.status(400).json({error:'not a premium user'})
        }

    }
    catch(err){
        console.log(err)
        res.status(400).json({error:err})
    }
}
