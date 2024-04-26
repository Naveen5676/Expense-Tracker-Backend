const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const UUID = require('uuid')

const forgotpwdmodal = sequelize.define('forgotpwddata',{
 id:{
    type:Sequelize.UUID,
    primaryKey:true,
    allowNull:false,
    },
 userid: Sequelize.INTEGER,
 isactive:Sequelize.BOOLEAN
})

module.exports = forgotpwdmodal