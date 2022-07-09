const jwt = require('jsonwebtoken')
const User = require('../model/user')

module.exports = async (req, res) => {
    const dataCookies = req.cookies;

    if(!('refreshToken' in dataCookies)) return res.status(401).json({ code : 401, status : 'Unauthoried'})

    const foundUser = await User.findOne({ where : { refreshToken : dataCookies.refreshToken }})

    if(!foundUser) return res.status(403).json({ code : 403, status : 'Forbidden'})

    jwt.verify(dataCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET , (err, decoded) => {
        if(err || foundUser.id !== decoded.data) return res.status(403).json({ code : 403, status : 'Forbidden', msg : 'Invalid Token' })

        const accessToken = jwt.sign({
            data : foundUser.id
        }, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '15m' });

        let currentTime = Date.now()
        let expTime = currentTime + (60000 * 60 * 3)
        return res.status(200).json({
            code : 200,
            status : 'OK',
            data : {
                accessToken : accessToken,
                exp : new Date(expTime).toLocaleString(),
                time : new Date(currentTime).toLocaleString()
            }
        })
    })
}