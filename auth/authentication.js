const bcrypt = require('bcrypt')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

module.exports = {
    authenticateUser : async (req, res) => {
        try {
            const { username, password } = req.body

            const userExist = await User.findOne({ where : { email : username } })

            if(!userExist) {
                return res.status(401).json({
                    code : 401,
                    status : 'Unauthorized',
                    msg : 'User is not existed'
                })
            }

            if(bcrypt.compareSync(password, userExist.password)) {
                const accessToken = jwt.sign({
                    data : userExist.id
                }, process.env.ACCESS_TOKEN_SECRET ,{ expiresIn: '15m' });

                const refreshToken = jwt.sign({
                    data : userExist.id
                }, process.env.REFRESH_TOKEN_SECRET ,{ expiresIn: '3d' });

                // Save refresh token to database
                userExist.refreshToken = refreshToken
                await userExist.save()

                // Set cookie for refresh token
                res.cookie('refreshToken', refreshToken, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 })

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
            } else {
                return res.status(401).json({
                    code : 401,
                    status : 'Unauthorized',
                    msg : 'Wrong password'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                code : 500,
                status : 'Internal System Error',
                msg : 'Something went wrong'
            })
        }
    },
    // handleRefreshToken : (req, res) => {

    // },
    // handle
}