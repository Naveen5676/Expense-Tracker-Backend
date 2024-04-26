const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const  jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(id){
  return jwt.sign({userId : id } , '564894165489465asdfsa48949848564sa98df985sa456498asdf')
}

exports.signup = (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      throw new Error("Something went wrong while hashing a password");
    }
    try {
      let user = await usermodel.create({
        name: name,
        email: email,
        password: hash,
        ispremiumuser:0,
        totalexpense:0,
      });
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  usermodel
    .findAll({ where: { email: email } })
    .then((users) => {
      if (users.length == 0) {
        throw new Error('could  not find any users with this email');
      }
      const user = users[0];
      bcrypt.compare(password, user.password, (error, result) => {
        if (!error) {
          return res.status(200).json({ message: "success" , Token:generateAccessToken(user.id) });
        } else {
          return res.status(401).json({ error: "Password does not match" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.findpremiumuser = (req,res,next)=>{
  usermodel.findOne({where: {id:req.user.id}}).then((response)=>{
    //console.log('find premium', response.dataValues.ispremiumuser)
    res.status(200).json(response.dataValues.ispremiumuser)
  }).catch((err)=>{
  res.status(201).json({err,message :'error in findpremiumuser controller'})
  })
}

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.FORGOTPWD_API_KEY;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email.

// exports.forgotpwd = (req,res,next)=>{
//   console.log('forgotpwd ====>', req.body.email )
//   sendSmtpEmail = {
//     sender:{email : 'naveenwali403@gmail.com'},
//     subject:"emial for password generation",
//     to: [{
//         email: 'naveenwali88@gmail.com',
//         name: 'John Doe'
//     }],
//     templateId: 3,
//     params: {
//         name: 'John',
//         surname: 'Doe'
//     },
//     headers: {
//         'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
//     }
// };

// apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
//   res.status(200).json(data)
// }, function(error) {
//   console.error(error);
// });
// };
exports.forgotpwduser=(req,res,next)=>{
  const sender={
    email:'naveenwali403@gmail.com'
  }
  const receivers=[
    {
      email:'naveenwali88@gmail.com'
    }
  ]

  apiInstance.sendTransacEmail({
    sender,
    to:receivers,
    subject:'aaaaaaaaaaaaaaaa',
    textContent: `Your verification code is `
  }).then(function(data){
      console.log('API called successfully. Returned data: ' + data);
      res.status(200).json(data)
  }),function(error) {
      console.error(error);
  }

};