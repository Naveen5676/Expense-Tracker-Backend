const express = require('express');
const expenseController = require('../controllers/expense')

const authorizationMiddleware = require('../middleware/authorization')

const router = express.Router()

router.post('/expense' , authorizationMiddleware.authorization , expenseController.Addexpense);
router.get('/showexpense' , authorizationMiddleware.authorization ,expenseController.ShowExpense);

router.delete('/delete/:id' ,  authorizationMiddleware.authorization , expenseController.deleteExpense);

router.get('/downloadexpense' , authorizationMiddleware.authorization , expenseController.downnloadexpense);

module.exports = router