const expensemodel = require("../models/expense");

exports.Addexpense = (req, res, next) => {
  const userid = req.user.id;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  expensemodel
    .create({
      expenseamt: amount,
      description: description,
      category: category,
      userdatumId:userid
    })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => console.log(err));
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

exports.deleteExpense = (req, res, next) => {
  const expenseid = req.params.id;
  const  userId = req.user.id;

  expensemodel
   .findOne({where : { id:expenseid , userdatumId: userId }})
    .then((data) => {
      if (!data) {
        return res.status(404).send("Expense not found");
      } else {
        return data.destroy();
      }
    })
    .then(() => {
      res.status(204).send("Deleted");
    })
    .catch((err) => {
      console.log(err);
    });
};

