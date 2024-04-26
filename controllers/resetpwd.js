const UUID = require("uuid");
const bcrypt = require("bcrypt");

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

const userModal = require("../models/user");
const forgotowdmodal = require("../models/forgotpwd");
const forgotpwdmodal = require("../models/forgotpwd");
const usermodel = require("../models/user");



exports.forgotpwd = async (req, res, next) => {
  try {
    let email = req.body.email;
    const user = await userModal.findOne({ where: { email: email } });
    if (user) {
      const id = UUID.v4(); //generate unique token for the user to reset password
      forgotowdmodal
        .create({ id: id, isactive: true, userdatumId: user.id })
        .catch((err) => {
          throw new Error(err);
        });

        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.FORGOTPWD_API_KEY;

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const sender={
            email:'naveenwali403@gmail.com'
          }
          const receivers=[
            {
              email:email
            }
          ]
        
          apiInstance.sendTransacEmail({
            sender,
            to:receivers,
            subject:'link to reset your  Password',
            textContent: `Your reset link is provide click on it or paste it in the browser `,
            htmlContent:`<h1>Click on reset password below to rest your password</h1><br /><a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`
          }).then(function(data){
              console.log('API called successfully. Returned data: ' + data);
              res.status(200).json({message :'Link to reset password sent to your mail'})
          }),function(error) {
              console.error(error);
              throw new Error(error);
          }

    }else{
        throw new Error('user doent exists')
    }
  } catch (error) {
    return res.json({message: err , success:false})
  }
};


exports.resetpwd = async (req,res,next)=>{
    const id = req.params.id
    const forgotpwduser  = await forgotowdmodal.findOne({where : {id : id}})
    if(forgotpwduser){
        forgotpwduser.update({isactive: false})
        res.status(200).send(`
        <html>
        <script>
          function formsubmitted(e){
            e.preventDefault();
            console.log('called)
          }
        </script>

        <form action='/updatepassword/${id}' method="get">
          <label>Enter New Password</label><br/>
          <input name="newpassword" type="password" required />
          <button>reset password</button>
        </form>
        </html>
        `)
        res.end()
    }
}

exports.updatepwd = (req,res,next)=>{
  try{
    const {newpassword} = req.query;
    const {resetpasswordid} = req.params;

    forgotpwdmodal.findOne({where : {id: resetpasswordid}}).then((resetpasswordrequest)=>{
      usermodel.findOne({where : {id : resetpasswordrequest.userdatumId}}).then((user)=>{
        if(user){
          const slatround= 10
          bcrypt.hash(newpassword , slatround , (err , hash)=>{
            if(err){
              console.log(err);
              throw new Error(err)
            }
            user.update({password: hash}).then(()=>{
              res.status(201).json({message : 'Successfully update the new password'})
            })
          })
        }
        else{
          return res.status(404).json({error : 'no user exists'})
        }
      })
    })

  }catch(err){
      return res.status(403).json(err)
  }
}