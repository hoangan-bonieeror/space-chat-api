const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const Group = require('./group')
const Account = require('./account')

const GroupMembers = sequelize.define('tbl_group_members', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    joined_datetime : {
        type : DataTypes.DATE,
        defaultValue : Date.now()
    },
    left_datetime : {
        type : DataTypes.DATE,
        defaultValue : null
    },
    account_id : {
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

// GroupMembers.sync({force : true})

module.exports = GroupMembers