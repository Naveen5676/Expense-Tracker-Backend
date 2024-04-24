const jwt = require("jsonwebtoken");
const usermodel = require("../models/user");

exports.authorization = (req, res, next) => {
  try {
    //get token form header
    const token = req.header('Authorization');
    //console.log('token ====>',token)
    const user = jwt.verify( token , '564894165489465asdfsa48949848564sa98df985sa456498asdf')
    //console.log('user token====>',user)
    usermodel.findByPk(user.userId).then((user)=>{
        if(!user){
            res.status(500).json({message : "User Not Found"})
        }
        req.user=user;
        //console.log('user ====>',user)
        next();// in order to pass to they next fucntion or pass control to next  otherwise it would  stop the execution of code here and will not go
    })
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
