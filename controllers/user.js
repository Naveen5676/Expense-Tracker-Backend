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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  usermodel
    .findAll({where :{email :email}})
    .then((users) => {
      if (users.length == 0) {
        return res.status(404).json({ error: "Email not found" });
      }
      const user = users[0]
      if (user.password === password) {
        return res.status(200).json({ message: "success" });
      } else {
        return res.status(401).json({ error: "Password does not match" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error:'server error'})
    });
};
