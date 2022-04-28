const { DataTypes, DATE } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')
const Conversation = require('./conversation')

const Group_Member = sequelize.define('tbl_group_member', {
    joined_datetime : {
        type : DataTypes.DATE,
        defaultValue : Date.now()
    },
    left_datetime : {
        type : DataTypes.DATE,
        defaultValue : null
    },
    user_id : {
        type : DataTypes.UUID,
        references : {
            model : User,
            key : 'user_id'
        }
    },
    conversation_id : {
        type : DataTypes.UUID,
        references : {
            model : Conversation,
            key : 'conversation_id'
        }
    }
})

// Group_Member.sync({alter : true})

module.exports = Group_Member