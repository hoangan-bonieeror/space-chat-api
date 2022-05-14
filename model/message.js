const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const Conversation = require('./conversation')
const User = require('./user')

const Message = sequelize.define('tbl_messages', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        field : 'message_id'
    },
    message_text : {
        type : DataTypes.TEXT,
        allowNull : false,
        field : 'message_text'
    },
    conversation_id : {
        type : DataTypes.UUID,
        references : {
            model : Conversation,
            key : 'conversation_id'
        }
    },
    sender_id  : {
        type : DataTypes.UUID,
        references : {
            model : User,
            key : 'user_id'
        }
    }
})

// Message.sync({alter : true})

module.exports = Message