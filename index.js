const cors = require("cors");
const exress = require("express");
const bodyparser = require("body-parser");
const sequelize = require("./utils/database");

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

app.use(cors());
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
