const cors = require("cors");
const exress = require("express");
const bodyparser = require("body-parser");
const sequelize = require("./utils/database");

const userrouter = require("./routes/user");
const expenserouter = require('./routes/expense');

const app = exress();

app.use(cors());
app.use(bodyparser.json({ extended: false }));
app.use(userrouter);
app.use(expenserouter);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
