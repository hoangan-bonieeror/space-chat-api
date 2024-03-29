const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')
const Account = require('./account')

const Message = sequelize.define('tbl_messages', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey : true,
        field : 'message_id'
    },
    content : {
        type : DataTypes.TEXT,
        allowNull : false,
        field : 'content'
    },
    sender_id  : {
        type : DataTypes.STRING,
        references : {
            model : Account,
            key : 'account_id'
        }
    },
    receiver_id : {
        type : DataTypes.STRING,
        references : {
            model : Account,
            key : 'account_id'
        }
    }
})

// Message.sync({alter : true})

module.exports = Message