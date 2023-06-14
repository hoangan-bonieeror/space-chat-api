const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection');
const User = require('./user');
const Friendship = sequelize.define('tbl_friendships', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    requester_id : {
        type : DataTypes.UUID,
        field : 'requester_id',
        references : {
            model : User,
            key : 'user_id'
        }
    },
    addressee_id : {
        type : DataTypes.UUID,
        field : 'addressee_id',
        references : {
            model : User,
            key : 'user_id'
        }
    },
    accepted_at : {
        type : DataTypes.DATE,
        field : 'accepted_at',
        defaultValue : null
    }
})

// Friendship.sync({ force : true });

module.exports = Friendship