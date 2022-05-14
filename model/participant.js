const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')
const Conversation = require('./conversation')

const Participants = sequelize.define('tbl_participants', {
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

// Participants.sync({alter : true})

module.exports = Participants