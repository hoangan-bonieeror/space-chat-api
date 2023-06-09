const bcrypt = require('bcrypt')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const { SUCCESS_RESPONSE, UNAUTHORIZED_RESPONSE } = require('../utils/response')
const catchInternalError = require('../utils/catchInternalError')
const { validationResult } = require('express-validator')
const { Account } = require('../model')
const { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } = require('../const/const')

module.exports = {
    authenticateUser : async (req, res) => {
        try {
            const resultValidation = validationResult(req)
            if(resultValidation && resultValidation.errors.length) {
                throw resultValidation.errors
            }
            const { username, password } = req.body

            const found = await Account.findOne({ where : { username : username } })
            const isMatchPassword = bcrypt.compare(password, found.password)

            if(isMatchPassword) {
                const accessToken = jwt.sign(
                    { data : found.id },
                    process.env.ACCESS_TOKEN_SECRET , { expiresIn: ACCESS_TOKEN_AGE });

                const refreshToken = jwt.sign(
                    { data : found.id },
                    process.env.REFRESH_TOKEN_SECRET , { expiresIn: REFRESH_TOKEN_AGE });

                // Set cookie for refresh token
                res.cookie('refreshToken', refreshToken, { httpOnly : true, maxAge : +REFRESH_TOKEN_AGE*3 })

                const response = {
                    ...SUCCESS_RESPONSE,
                    accessToken
                }
                return res.status(response.code).json(response)
            } else {
                const response = {
                    ...UNAUTHORIZED_RESPONSE,
                    msg : 'Incorrect password'
                }
                return res.status(response.code).json(response)
            }
        } catch (error) {
            console.log(error)
            catchInternalError(res, error)
        }
    }
}