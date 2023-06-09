const express = require('express')
const controller = require('../controller/user.controller')
const { validateUpdateUserInfo, validateResetPassword } = require('../middlewares/validator')
const upload = require('../utils/upload')
const validateHandler = require('../middlewares/validateHandler')

const router = express.Router()
router.get('/', controller.getUserInfo)
router.put('/', validateUpdateUserInfo, validateHandler, controller.updateInfo)
router.post('/passwords', validateResetPassword, validateHandler, controller.resetPassword)

module.exports = router;
