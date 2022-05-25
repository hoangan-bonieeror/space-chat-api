const express = require('express')
const controller = require('../controller/message.controller')

const router = express.Router()

router.post('/from/:sender_id/to/:conversation_id', controller.sendMessageToConversation)
router.get('/:conversation_id/get-all-messages', controller.getAllMessageByConversationId)

module.exports = router