const User = require("../model/user")
const Account = require('../model/account')
const cloudinary = require('../utils/cloud_config')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { uid } = require("uid")


class UserService {
    constructor(){}

    async register(input) {
        const { rawObj, fileObj } = input
        let user = User.build({
            firstname : rawObj.firstname,
            lastname : rawObj.lastname,
            phone_number : rawObj.phone_number,
            email : rawObj.email,
            profile_bio : rawObj.profile_bio,
            profile_photo : rawObj.profile_photo,
            account_id : rawObj.account_id
        })


        // Update url of the avatar photo
        if(fileObj) {
            await cloudinary.v2.uploader.upload(fileObj.path,(err, result) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                user.profile_photo = result.url;
                fs.unlinkSync(fileObj.path)
            })
        }
        const hash = await bcrypt.hash(rawObj.password, 8)
        const account_id = uid(10)
        const userAccount = Account.build({
            id: account_id,
            username : user.email,
            password : hash
        })
        await userAccount.save()
        user.account_id = userAccount.id
        await user.save()
    }
    async updateInfo(input, account_id) {
        const { rawObj, fileObj } = input

        const found_user = await User.findOne({ where : { account_id : account_id } })

        for(const [key, value] of Object.entries(rawObj)) {
            found_user[key] = value
        }

        // Update url of the avatar photo
        if(fileObj) {
            await cloudinary.v2.uploader.upload(fileObj.path,(err, result) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                found_user.profile_photo = result.url;
                fs.unlinkSync(fileObj.path)
            })
        }
        await found_user.save()
    }
    async resetPassword(account_id, new_password) {
        const hash = await bcrypt.hash(new_password, 8)
        await Account.update({ password : hash }, { where : { account_id : account_id } })
    }
    async getAccountInfo(account_id) {
        const found = await User.findOne({ where : { account_id : account_id }})
        return found
    }
}
const userService = new UserService()
module.exports = userService