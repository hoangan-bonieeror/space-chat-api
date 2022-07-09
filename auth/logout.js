const jwt = require('jsonwebtoken')
const User = require('../model/user')

module.exports = async (req, res) => {
    const dataCookies = req.cookies;

    if(!('refreshToken' in dataCookies)) return res.status(401).json({ code : 401, status : 'Unauthoried'})

    const foundUser = await User.findOne({ where : { refreshToken : dataCookies.refreshToken }})

    if(!foundUser) {
        res.clearCookie('refreshToken', { httpOnly : true });
        return res.sendStatus(204)
    }

    await foundUser.update({ refreshToken : '' })

    res.clearCookie('refreshToken', { httpOnly : true })
    return res.sendStatus(204);
}