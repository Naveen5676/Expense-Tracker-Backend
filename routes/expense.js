const express = require('express');
const expenseController = require('../controllers/expense')

const router = express.Router()

router.post('/expense' , expenseController.Addexpense);
router.get('/showexpense' , expenseController.ShowExpense);

router.delete('/delete/:id' , expenseController.deleteExpense);

module.exports = router