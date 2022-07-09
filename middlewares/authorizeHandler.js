const User = require('../model/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if(!authHeader) return res.status(401).json({ code : 401, status : 'Unauthorized'})

    const accessToken = authHeader.split(' ')[1] // Bearer Token;
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({ code : 403, status : 'Forbidden', msg : 'Invalid Token' })
        // req.user = decoded.data
        next()
    })
}