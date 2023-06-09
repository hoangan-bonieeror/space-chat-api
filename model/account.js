const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')

const Account = sequelize.define('tbl_accounts', {
    id : {
        type : DataTypes.STRING,
        primaryKey : true,
        field : 'account_id'
    },
    username : {
        type : DataTypes.STRING,
        field : 'username'
    },
    password : {
        type : DataTypes.STRING,
        field : 'password'
    }
})

// Account.sync({ alter : true })

module.exports = Account