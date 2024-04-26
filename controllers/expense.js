const expensemodel = require("../models/expense");
const usermodel = require("../models/user");
const sequelize = require("../utils/database");
const S3services = require("../services/S3services");
const filesdownloadedmodal = require('../models/filesdownloaded');

exports.Addexpense = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const userid = req.user.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    const expense = await expensemodel.create(
      {
        expenseamt: amount,
        description: description,
        category: category,
        userdatumId: userid,
      },
      { transaction: t }
    );

    const user = await usermodel.findOne(
      { where: { id: userid } },
      { transaction: t }
    );
    if (!user) {
      throw new Error("User not found"); // Handle case where user is not found
    }
    if (user) {
      const updatedtotalexpense = Number(user.totalexpense) + Number(amount);
      await user.update(
        { totalexpense: updatedtotalexpense },
        { transaction: t }
      );
    }
    await t.commit();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json(err);
  }
};

exports.ShowExpense = (req, res, next) => {
  //console.log('in expense Controller ======>',req.user)
  const userId = req.user.id;

  // Ensure userId is defined and valid before querying the database
  if (!userId) {
    return res.status(400).json({ error: "User ID is missing or invalid" });
  }

  expensemodel
    .findAll({ where: { userdatumId: userId } })
    // req.user.getExpenses()
    .then((data) => {
      if (data.length === 0) {
        // No expenses found for the user
        return res
          .status(200)
          .json({ message: "No expenses found for the user" });
      }
      // Respond with the retrieved expenses
      res.status(200).json(data);
    })
    .catch((err) => {
      // Handle errors appropriately
      console.error("Error retrieving expenses:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseid = req.params.id;
    const userId = req.user.id;
    //find the expense to delete form expense table
    const data = await expensemodel.findOne({
      where: { id: expenseid, userdatumId: userId },
    });

    if (!data) {
      return res.status(404).send("Expense not found");
    }

    //fidn the user to update total expense
    const user = await usermodel.findOne({ where: { id: userId } });
    if (user) {
      const updatedtotalexpense =
        Number(user.totalexpense) - Number(data.expenseamt);
      if (updatedtotalexpense <= 0) {
        user.update({ totalexpense: 0 });
      } else {
        user.update({ totalexpense: updatedtotalexpense });
      }
    }
    //delete the expense
    await data.destroy();
    return res.status(204).send("Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "error while deleting expense" });
  }
};

exports.downnloadexpense = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const expenses = await expensemodel.findAll({
      where: { userdatumId: userid },
    });
    //console.log(expenses)

    const stringifyiedExpenses = JSON.stringify(expenses);
    //I have added user id because if  we keep same filename the old file name data would get overdied with new data and there would be no version controll
    const filename = `expenses${userid}/${new Date()}.txt`;
    const fileURL = await S3services.uploadtoS3(stringifyiedExpenses, filename);
    //console.log('fileurl ========>', fileURL)
    filesdownloadedmodal.create({downloadurl: fileURL , userdatumId : userid})
    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ fileurl: "", success: false, error: error });
  }
};
