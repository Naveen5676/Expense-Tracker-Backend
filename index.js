const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const exress = require("express");
const bodyparser = require("body-parser");
const sequelize = require("./utils/database");
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


const userrouter = require("./routes/user");
const expenserouter = require('./routes/expense');
const purchaserouter = require('./routes/purchase');
const premiumrouter = require('./routes/premium');
const forgotpwdrouter = require('./routes/resetpwd');
const filesdownloadedrouter = require('./routes/filesdownloaded');

const Expense = require('./models/expense');
const User = require( './models/user' );
const Order = require('./models/purchase');
const Forgotpwd = require('./models/forgotpwd');
const Filesdownloadurl = require('./models/filesdownloaded');


const app = exress();

//to store they console.log in a file and flag a refers to append 
const accessLogScreen = fs.createWriteStream(path.join(__dirname , 'access.log'), {flags: 'a'})



app.use(cors());
//helmet  is used for security purpose
app.use(helmet());
//morgan is used to write all logs to a file called access.log
app.use(morgan('combined' , {stream:accessLogScreen}));
app.use(bodyparser.json({ extended: false }));
app.use(userrouter);
app.use(expenserouter);
app.use(purchaserouter);
app.use(premiumrouter);
app.use(forgotpwdrouter);
app.use(filesdownloadedrouter);


User.hasMany(Expense)
Expense.belongsTo(User)
//------------------------
User.hasMany(Order)
Order.belongsTo(User)
//------------------------
User.hasMany(Forgotpwd)
Forgotpwd.belongsTo(User)
//------------------------
User.hasMany(Filesdownloadurl)
Filesdownloadurl.belongsTo(User)


sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
