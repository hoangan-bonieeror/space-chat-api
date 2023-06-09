const User = require('../model/user')
const jwt = require('jsonwebtoken')
const { UNAUTHORIZED_RESPONSE, FORBIDDEN_RESPONSE, SUCCESS_RESPONSE } = require('../utils/response')
const { JWT_ERROR, ACCESS_TOKEN_AGE } = require('../const/const')
require('dotenv').config()

module.exports = (req, res, next) => {
    // Access Bear Token through authorization property in the header of the request
    const authHeader = req.headers['authorization']
    if(!authHeader) {
        const response = {
            ...UNAUTHORIZED_RESPONSE,
            msg : 'Missing access token'
        }
        return res.status(response.code).json(response)
    }

    // Extract token string (Formar on header : 'Bearer Token')
    const accessToken = authHeader.split(' ')[1]
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            // Access token is dead
            // Cases : Expired, Error decode
            let response;
            if(err.name === JWT_ERROR.DECODED) {
                response = {
                    ...FORBIDDEN_RESPONSE,
                    msg : 'Invalid Token'
                }
                return res.status(response.code).json(response)
            } 

            // Check refresh token on cookies
            const dataCookies = req.cookies;
            if (!("refreshToken" in dataCookies)) {
                response = {
                    ...UNAUTHORIZED_RESPONSE,
                    msg : 'Missing refresh token on cookies'
                }
                return res.status(response.code).json(response)
            }
            // Re-create access token for user
            const refreshToken = dataCookies.refreshToken;
            try {
                // Successfully decoded refresh token
                // And create new access token
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
                const newAccessToken = jwt.sign({
                    data : decoded.data
                }, process.env.ACCESS_TOKEN_SECRET , { expiresIn: ACCESS_TOKEN_AGE });
                // Attach new access token to header of response
                // Purpose : client accessible
                res.set('X-Access-Token', newAccessToken)
                appendUserToRequest(req, decoded.data)
                return next()
                
            } catch (errorDecodeRefreshToken) {
                // Fail to decode refresh token
                let errorResponse;
                switch (errorDecodeRefreshToken.name) {
                    case JWT_ERROR.EXPIRED:
                        errorResponse = {
                            ...UNAUTHORIZED_RESPONSE,
                            msg : 'Token is expired'
                        }
                        break
                    case JWT_ERROR.DECODED:
                        errorResponse = {
                            ...FORBIDDEN_RESPONSE,
                            msg : 'Invalid Token'
                        } 
                }
                return res.status(errorResponse.code).json(errorResponse)
            }
        } else {
            // Access token is still alive
            // Then skip the authorization and allow to access data
            appendUserToRequest(req, decoded.data)
            next()
        }
    })
}


const appendUserToRequest = (req, userID) => {
    req.user = userID
}