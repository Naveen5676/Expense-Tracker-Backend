const sequelize = require('../utils/database')
const Sequelize = require('sequelize')

const orderModal = sequelize.define('orderdata',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = orderModal