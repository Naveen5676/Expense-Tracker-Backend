const Razorpay = require("razorpay");
const orderModal = require("../models/purchase");
const userModel = require("../models/user");
require("dotenv").config();

exports.purchasepremium = async (req, res, next) => {
  const userid = req.user.id;
  //console.log('key id ============>', process.env.RAZORPAY_KEY_ID)
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    //console.log('key id ============>', process.env.RAZORPAY_KEY_ID)
    const amount = 2500;

    rzp.orders.create({ amount: amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      orderModal
        .create({ orderid: order.id, status: "PENDING", userdatumId: userid })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ message: "something went wrong", error: error });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    //console.log("payment id =====>", payment_id);
    //this will get they order  from the database which is related to this orderid
    const order = await orderModal.findOne({ where: { orderid: order_id } });
    //now update they  transaction status in the orders table
    const promise1 = order.update({ paymentid: payment_id, status: "SUCCESSFUL" });
    //here get they current user
    const user = await userModel.findOne({ where: { id: req.user.id } });
    //update they current user premium as true 
    const promise2= user.update({ ispremiumuser: true });

    //we use promise.all to increase they performance of page because we can run both promises 
    //parallely not one after another or both run together or execute together which is faster 
    Promise.all([promise1,promise2]).then(()=>{
        return res
        .status(202)
        .json({ success: true, message: "Transaction Successful" });
    }).catch((err)=>{
        throw new Error(err)
    })
   
  } catch (err) {
    res.status(403).json(err);
  }
};

exports.failedTransactionStatus = async (req, res, next) => {
  try {
    const order_id = req.body.order_id;
    const order = orderModal.findOne({ where: { orderid: order_id } });
    await order.update({ status: "FAILED" });
    return res.status(200).json({ message: "updated  in db as status failed" });
  } catch (err) {
    res.status(201).json(err);
  }
};
