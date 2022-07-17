const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('../utils/cloud_config')
const fs = require('fs')
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
    createUser : async (req, res) => {
        try {
            const body = {
                firstname : (!req.body.firstname || req.body.firstname.length === 0) ? undefined : req.body.firstname,
                lastname : (!req.body.lastname || req.body.lastname.length === 0) ? undefined : req.body.lastname,
                phone_number : (!req.body.phone_number || req.body.phone_number.length === 0) ? undefined : req.body.phone_number,
                email : (!req.body.email || req.body.email.length === 0) ? undefined : req.body.email,
                password : (!req.body.password || req.body.password.length === 0) ? undefined : req.body.password
            }

            // Check any empty field
            for(const [key, value] of Object.entries(body)) {
                if(value === undefined) {
                    return res.json({
                        code : 400,
                        status : 'Bad Request',
                        msg : "Can't leave any fields blank is required"
                    })
                }
            }

            // Check syntax phone number
            let isPhoneValid = ValidatePhone(body.phone_number)
            if(!isPhoneValid) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Invalid phone number'
                })
            }
    
            const userExist = await User.findOne({ where : { email : [body.email,'@space.com'].join('') } })
    
            if(userExist === null) {
                const hash = await bcrypt.hash(body.password, 8)

                let userNew = User.build({
                    firstname : body.firstname,
                    lastname : body.lastname,
                    phone_number : body.phone_number,
                    email : [body.email,'@space.com'].join(''),
                    password : hash
                })
                
                if(req.file !== undefined) {
                    await cloudinary.v2.uploader.upload(req.file.path,(err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        // console.log(result)
                        userNew.profile_photo = result.url;
                        fs.unlinkSync(req.file.path)
                    })
                }
                
                await userNew.save()
                return res.json({
                    code : 200,
                    status : 'OK',
                    msg : 'Created Successfully',
                    newRord : userNew
                })
            } else {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Email is not available'
                })
            }
        } catch (error) {
            catchInternalError(res,error)
        }
    },
    deleteUser : async (req, res) => {
        try {
            const { user_id } = req.params

            const userExist = await User.findByPk(user_id)

            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Id is not exist'
                })
            } else {
                userExist.destroy()
                return res.json({
                    code : 200,
                    status : 'OK',
                    msg : 'Deleted Successfully'
                })
            }
        } catch (err) {
            catchInternalError(res,error)
        }
    },
    getUserById : async (req, res) => {
        try {
            (await User.findByPk(req.params.user_id) === null)
            ? res.json({
                code : 400,
                status : 'Bad Request',
                msg : 'Id is not exist'
            })
            : res.json({
                code : 200,
                status : 'OK',
                msg : 'Successfully',
                data : await User.findByPk(req.params.user_id)
            })
        } catch(error) {
            catchInternalError(res,error)
        }
    },
    modifyUser : async (req,res) => {
        try {
            let {user_id} = req.params

            const userModify = await User.findByPk(user_id)

            if(userModify === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Id is not exist'
                })
            } else { 
                let body = {
                    firstname : (!req.body.firstname || req.body.firstname.length === 0) ? undefined : req.body.firstname,
                    lastname : (!req.body.lastname || req.body.lastname.length === 0) ? undefined : req.body.lastname,
                    phone_number : (!req.body.phone_number || req.body.phone_number.length === 0) ? undefined : req.body.phone_number,
                    profile_bio : (!req.body.profile_bio || req.body.profile_bio.length === 0) ? undefined : req.body.profile_bio,
                }

                for(const [key, value] of Object.entries(body)) {
                    if(value !== undefined && userModify[key].trim() !== value.trim()) {
                        userModify[key] = value
                    }
                }

                if(req.file !== undefined) {
                    await cloudinary.v2.uploader.upload(req.file.path,(err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        // console.log(result)
                        userModify.profile_photo = result.url;
                        fs.unlinkSync(req.file.path)
                    })
                }

                await userModify.save()
                return res.json({
                    code : 200,
                    status : 'OK',
                    msg : 'Modified Successfully',
                    modifiedRecord : userModify
                })
            }
        } catch (error) {
            catchInternalError(res,error)
        }
    }
}