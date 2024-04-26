const express = require('express');
const userController = require('../controllers/user');
const authorizationMiddleware = require('../middleware/authorization')

const router = express.Router();

router.post('/signup' , userController.signup);
router.post('/login', userController.login);
router.get('/checkpremium' ,authorizationMiddleware.authorization , userController.findpremiumuser)
router.post('/userforgotpwd' , userController.forgotpwduser)



module.exports = router

