const path = require('path');
const fs = require('fs')

const express = require('express');
//const helmet = require('helmet')
//const compression = require('compression')
//const morgan = require('morgan')
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const Forgotpass = require('./models/forgotpass');
const Downloadreport = require('./models/downloadreport')

const app = express();
 
// const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),
//                         {flags:'a'})

//app.use(helmet())
//app.use(compression())
//app.use(morgan('combined',{stream:accessLogStream}))
app.use(cors());


const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotpassRoutes = require('./routes/forgotpass');

//db.execute('SELECT * FROM products').then((result)=>console.log(result)).catch(err => console.log(err))

app.use(bodyParser.json({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoutes);
app.use('/password',forgotpassRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium', premiumRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpass);
Forgotpass.belongsTo(User)

User.hasMany(Downloadreport);
Downloadreport.belongsTo(User);

sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT || 3000)
    
    //  console.log(result)
})
.catch(err=>console.log(err))

