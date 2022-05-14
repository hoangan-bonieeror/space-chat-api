const express = require('express')
const controller = require('../controller/conversation.controller')

const router = express.Router()

router.post('/:user_id/create', controller.createConversation)
router.post('/:conversation_id/add/:user_id', controller.addUserToConversationById)
router.post('/:conversation_id/leave/:user_id', controller.leftConversationById)
router.get('/:conversation_id/get-participants', controller.getParticipantsById)
router.post('/:conversation_id/add-multiple', controller.addMultipleUserToConversationById)

module.exports = router;