const Sequelize = require("sequelize");
const expensemodel = require("../models/expense");
const usermodel = require("../models/user");

exports.getuserleaderhipBoard = async (req, res, next) => {
  try {
    const users = await usermodel.findAll();
    const expenses = await expensemodel.findAll();

    const userAggregatedExpenses = {};

    expenses.forEach((expense) => {
      if (userAggregatedExpenses[expense.userdatumId]) {
        userAggregatedExpenses[expense.userdatumId] += expense.expenseamt;
      } else {
        userAggregatedExpenses[expense.userdatumId] = expense.expenseamt;
      }
    });
    const userleaderboarddetails=[];
    users.forEach((user)=>{
        userleaderboarddetails.push({name: user.name , total_cost : userAggregatedExpenses[user.id] || 0 })

    })
    //console.log(userAggregatedExpenses);
    userleaderboarddetails.sort((a,b)=> b.total_cost - a.total_cost)
    res.status(200).json(userleaderboarddetails);
  } catch (err) {
    console.error(err);
  }
};
