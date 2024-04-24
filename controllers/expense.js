const expensemodel = require("../models/expense");

exports.Addexpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  expensemodel
    .create({
      expenseamt: amount,
      description: description,
      category: category,
    })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => console.log(err));
};

exports.ShowExpense = (req, res, next) => {
  expensemodel
    .findAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteExpense = (req, res, next) => {
  const id = req.params.id;

  expensemodel
    .findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send("Expense not found");
      }else{
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
