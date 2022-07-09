const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db_connection')

const User = sequelize.define('tbl_users' , {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        field : 'user_id'
    },
    firstname : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull : { msg : 'User must have the firstname' },
            len : [2, 8]
        },
        field : 'first_name'
    },
    lastname : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull : { msg : 'User must have the lastname' },
            len : [2, 8]
        },
        field : 'last_name'
    },
    phone_number : {
        type : DataTypes.STRING,
        allowNull : true,
        field : 'phone_number'
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'email'
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'password'
    },
    profile_photo : {
        type : DataTypes.STRING,
        allowNull : true,
        defaultValue : null,
        field : 'profile_photo'
    },
    profile_bio : {
        type : DataTypes.TEXT,
        defaultValue : null,
        field : 'profile_bio'
    },
    refreshToken : {
        type : DataTypes.STRING,
        defaultValue : null,
        field : 'refresh_token',
        set(newRefreshToken) {
            this.setDataValue('refreshToken', newRefreshToken)
        }
    }
})

// User.sync({alter : true})

module.exports = User