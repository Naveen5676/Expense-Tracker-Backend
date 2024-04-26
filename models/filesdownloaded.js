const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const filesdownloaded = sequelize.define('filesurldata', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    downloadurl:Sequelize.STRING

})

module.exports = filesdownloaded