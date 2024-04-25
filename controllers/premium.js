const Sequelize = require("sequelize");
const expensemodel = require("../models/expense");
const usermodel = require("../models/user");
const sequelize = require("../utils/database");
const { compareSync } = require("bcrypt");

exports.getuserleaderhipBoard = async (req, res, next) => {
  try {
    const leaderboardofuser = await usermodel.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('sum', sequelize.col('expensedata.expenseamt')), 'total_cost'] // first sum is the operation and get they col and then total_cost is they alias name
      ],
      include: [{
        model: expensemodel,
        attributes: []
      }],
      group: ['userdata.id'] ,// Include all non-aggregated columns in GROUP BY
      order:[[sequelize.col('total_cost') , "DESC"]] // in order to display maximum first or in descending order
    });

    res.status(200).json(leaderboardofuser);
  } catch (err) {
    console.error(err);
  }
};
