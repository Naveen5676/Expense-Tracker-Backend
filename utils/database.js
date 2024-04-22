const Sequelize = require('sequelize')

const sequelize = new Sequelize ('expense' , 'root' , 'Abcd@1234',{
    dialect:"mysql",
    host:"localhost"
})

module.exports = sequelize