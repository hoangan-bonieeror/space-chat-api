const express = require('express')
const controller = require('../controller/conversation.controller')

const router = express.Router()

router.post('/:user_id/create', controller.createConversation)
router.post('/:conversation_id/add/:user_id', controller.addToRoomById)
router.post('/:conversation_id/leave/:user_id', controller.leftFromRoomById)

module.exports = router;