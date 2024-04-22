const usermodel = require("../models/user");

exports.signup = (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  usermodel
    .create({
      name: name,
      email: email,
      password: password,
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
