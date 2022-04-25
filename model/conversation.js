const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')

const Conversation = sequelize.define('tbl_conversations', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        field : 'conversation_id'
    },
    conversation_name : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'conversation_name'
    }
})

Conversation.sync({alter : true})

module.exports = Conversation