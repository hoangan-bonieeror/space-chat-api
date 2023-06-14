const { ExpressValidator } = require('express-validator')
const { IMAGE_TYPES } =  require('../const/const')
const { Account, Group, GroupMembers } = require('../model')
const User = require('../model/user')

const { body, check, param, query } = new ExpressValidator({
    isImage : (_, { req }) => {
        if(!req.file) return true
        const allowMimeType = Object.values(IMAGE_TYPES)
        const [type , extension] = req.file.mimetype.split('/')
        return allowMimeType.includes(extension)
    },
    isMatchPassword : (value, { req }) => {
        return value == req.body.password
    },
    isEmailAvailable : async (email) => {
        const found = await User.findOne({ where : { email : email } })
        if(found) throw new Error('Email is not available')
    },
    isAccountExistByID : async (account_id) => {
        const found = await Account.findOne({ where : { id : account_id } })
        if(!found) throw new Error('Account is not exist')
    },
    isAccountExistByUsername : async (username) => {
        const found = await Account.findOne({ where : { username : username } })
        if(!found) throw new Error('Account is not exist')
    },
    isGroupExist : async (groupID) => {
        const found = await Group.findOne({ where : { id : groupID } })
        if(!found) throw new Error('Group is not exist')
    },
    isUserExist : async (user_id) => {
        const found = await User.findOne({ where : { id : user_id } })
        if(!found) throw new Error('User is not exist')
    }
})


module.exports = {
    manualRunValidate : () => {
        return check
    },
    validatePostUserBody : () => {
        return [
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid')
                .isEmailAvailable(),
            body('phone_number').isMobilePhone('vi-VN'),
            body('firstname').isLength({ min : 2, max : 8 }),
            body('lastname').isLength({ min : 2, max : 8 }),
            body('password').isLength({ min : 5 }),
            body('passwordConfirmation').isMatchPassword().withMessage('Confirmation is not match'),
            body('profile_bio').optional().isLength({ max : 150 }),
            check('avatar').isImage().withMessage('Mimetype is not allowed')
        ]
    },
    validatePostLogin : () => {
        return [
            body('username')
                .notEmpty().withMessage('Username is required')
                .isEmail().withMessage('Email is invalid')
                .isAccountExistByUsername(),
            body('password').notEmpty().withMessage('Password is required')
        ]
    },
    validateOneOnOneMessage : () => {
        return [
            ...validatePostMessage(),
            body('receiver_id').isAccountExistByID()
        ]
    },
    validateGroupMessage : () => {
        return [
            ...validatePostMessage(),
            param('group_id')
                .isGroupExist().withMessage('Group is not exist')
        ]
    },
    validatePostGroup : () => {
        return [
            body('title')
                .notEmpty().withMessage('Missing title')
                .isLength({ min : 0, max : 50 }).withMessage('Title length is required between 0 and 50 charaters')
        ]
    },
    validateAddMemberToGroup : () => {
        return [
            body('account_id')
                .notEmpty().withMessage('Missing account ID')
                .isAccountExistByID(),
            param('group_id')
                .isGroupExist().withMessage('Group is not exist')
        ]
    },
    validategetAllMessageByGroup : () => {
        return [
            param('group_id').isGroupExist()
        ]
    },
    validateGetAllMessagesByOther : () => {
        return [
            query('account_id')
                .notEmpty().withMessage('Missing other ID')
                .isAccountExistByID()
        ]
    },
    validateGetAllMembersByGroupID : () => {
        return [
            param('group_id').isGroupExist()
        ]
    },
    validateUpdateGroup : () => {
        return [
            param('group_id').isGroupExist()
        ]
    },
    validateRemoveMember : () => {
        return [
            param('group_id').isGroupExist(),
            body('account_id').isAccountExistByID()
        ]
    },
    validateUpdateUserInfo : () => {
        return [
            body('firstname').isLength({ min : 2, max : 8 }),
            body('lastname').isLength({ min : 2, max : 8 }),
            body('profile_bio').optional().isLength({ max : 150 }),
            body('phone_number').isMobilePhone('vi-VN')
        ]
    },
    validateResetPassword : () => {
        return [
            body('password').isLength({ min : 5 }),
            body('passwordConfirmation').isMatchPassword().withMessage('Confirmation is not match')
        ]
    },
    validateSendRequest : () => {
        return [
            body('addressee_id').notEmpty().withMessage('Addressee id is required'),
            body('addressee_id').isUserExist(),
            body('addressee_id').isUUID().withMessage('Invalid format')
        ]
    },
    validateAcceptRequest : () => {
        return [
            param('addressee_id').notEmpty().withMessage('Addressee id is required'),
            param('addressee_id').isUserExist() 
        ]
    },
    validateRemoveRequest : () => {
        return [
            param('addressee_id').notEmpty().withMessage('Addressee id is required'),
            param('addressee_id').isUserExist()
        ]
    }
}

const validatePostMessage = () => {
    let validateChain = [
        body('msg')
            .notEmpty().withMessage('Missing message')
            .isLength({ min : 0, max : 150 }).withMessage('Message length is required between 0 and 150 characters')
    ]
    return validateChain
}