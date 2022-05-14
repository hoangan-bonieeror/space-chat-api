const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')
const User = require('./user')

const Conversation = sequelize.define('tbl_conversations', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        field : 'conversation_id'
    },
    creator_id : {
        type : DataTypes.UUID,
        references : {
            model : User,
            key : 'user_id'
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

// Conversation.sync({force : true})

module.exports = Conversation