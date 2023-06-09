const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')
const Account = require('./account')

const Group = sequelize.define('tbl_groups', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        field : 'group_id'
    },
    creator_id : {
        type : DataTypes.STRING,
        references : {
            model : Account,
            key : 'account_id'
        }
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'title'
    },
    deleted_at : {
        type : DataTypes.DATE,
        defaultValue : null,
        field : 'deleted_at'
    }
})

// Group.sync({force : true})

module.exports = Group