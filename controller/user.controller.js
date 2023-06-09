const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('../utils/cloud_config')
const catchInternalError = require('../utils/catchInternalError')
const fs = require('fs')
const { matchedData, validationResult } = require('express-validator')
const UserService = require('../service/user.service')
const { SUCCESS_RESPONSE } = require('../utils/response')
const { Account } = require('../model')

require('dotenv').config()

const ValidatePhone = (phone) => {
    var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phone.match(phoneNum)) {
        return false
    } else {
        return true
    }
}

module.exports = {
    register : async (req, res) => {
        try {
            const validFields = matchedData(req)
            const input = {
                rawObj : validFields,
                fileObj : req.file
            }
            await UserService.register(input)
            const response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res,error)
        }
    },
    updateInfo : async (req,res) => {
        try {
            const account_id = req.user
            const validFields = matchedData(req)
            const input = {
                rawObj : validFields,
                fileObj : req.file
            }
            await UserService.updateInfo(input, account_id)
            const response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res,error)
        }
    },
    resetPassword : async (req, res) => {
        try {
            const account_id = req.user
            const { password } = req.body
            await UserService.resetPassword(account_id, password)
            const response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getUserInfo : async (req, res) => {
        try {
            const account_id = req.user
            const data = await UserService.getAccountInfo(account_id)
            const response = {
                ...SUCCESS_RESPONSE,
                data : data
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    }
}