const premiumController = require('../controllers/premium')
const express = require('express')
const authorizationMiddleware = require('../middleware/authorization')

const router = express.Router();

router.get('/showleaderboard' , premiumController.getuserleaderhipBoard)

module.exports = router