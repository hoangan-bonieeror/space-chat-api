const sequelize = require('../utils/db_connection')
const {DataTypes} = require('sequelize')
const Group = require('./group')
const Account = require('./account')

const GroupMessage = sequelize.define('tbl_group_messages', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        field : 'message_id'
    },
    content : {
        type : DataTypes.TEXT,
        allowNull : false,
        field : 'content'
    },
    sender_id : {
        type : DataTypes.STRING,
        references : {
            model : Account,
            key : 'account_id'
        }
    },
    group_id : {
        type : DataTypes.INTEGER,
        references : {
            model : Group,
            key : 'group_id'
        }
    }
})
// GroupMessage.sync({force : true})
module.exports = GroupMessage