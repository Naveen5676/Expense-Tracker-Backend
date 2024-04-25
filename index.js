const cors = require("cors");
const exress = require("express");
const bodyparser = require("body-parser");
const sequelize = require("./utils/database");

const userrouter = require("./routes/user");
const expenserouter = require('./routes/expense');
const purchaserouter = require('./routes/purchase');
const premiumrouter = require('./routes/premium');

const Expense = require('./models/expense');
const User = require( './models/user' );
const Order = require('./models/purchase')


const app = exress();

app.use(cors());
app.use(bodyparser.json({ extended: false }));
app.use(userrouter);
app.use(expenserouter);
app.use(purchaserouter);
app.use(premiumrouter);


User.hasMany(Expense)
Expense.belongsTo(User)
//------------------------
User.hasMany(Order)
Order.belongsTo(User)


sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
