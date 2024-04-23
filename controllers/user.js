const usermodel = require("../models/user");
const bcrypt = require("bcrypt");

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
          return res.status(200).json({ message: "success" });
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
