const express= require('express');
const resetpwdController = require('../controllers/resetpwd');


const router = express.Router()

router.post('/forgotpassword' , resetpwdController.forgotpwd);
router.get('/resetpassword/:id' , resetpwdController.resetpwd);
router.get('/updatepassword/:resetpasswordid', resetpwdController.updatepwd);

module.exports = router