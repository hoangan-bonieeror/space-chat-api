const express = require('express')
const controller = require('../controller/message.controller')
const { validateOneOnOneMessage, validateGetAllMessagesByOther } = require('../middlewares/validator')
const validateHandler = require('../middlewares/validateHandler')

const router = express.Router()

router.post('/', validateOneOnOneMessage(), validateHandler, controller.sendMessageOneOnOne)
router.get('/', validateGetAllMessagesByOther(), validateHandler, controller.getAllMessageByOneOnOne)
module.exports = router