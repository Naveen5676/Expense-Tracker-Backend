const express = require('express');
const purchaseController = require('../controllers/purchase')
const authorizationMiddleware = require('../middleware/authorization')

const router = express.Router()

router.get('/premiummembership' , authorizationMiddleware.authorization , purchaseController.purchasepremium )
router.post('/updatetransactionstatus', authorizationMiddleware.authorization , purchaseController.updateTransactionStatus)
router.post('/failedtransactionstatus' , authorizationMiddleware.authorization , purchaseController.failedTransactionStatus )

module.exports = router