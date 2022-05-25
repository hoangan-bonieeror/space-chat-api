const Message = require('../model/message')
const User = require('../model/user')
const Participants = require('../model/participant')
const Conversation = require('../model/conversation')
const catchInternalError = require('../utils/catchInternalError')
const { Op } = require('sequelize')

module.exports = {
    sendMessageToConversation : async (req,res) => {
        try {
            const { conversation_id, sender_id } = req.params

            const userExist_inConversation = await Participants.findOne({
                where : {
                    [Op.and] : {
                        user_id : sender_id,
                        conversation_id : conversation_id,
                        left_datetime : null
                    }
                }
            })

            if(userExist_inConversation === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'The user might not be in this conversation'
                })
            }

            const { message_text } = req.body

            const message = await Message.create({
                sender_id : userExist_inConversation.user_id,
                conversation_id : userExist_inConversation.conversation_id,
                message_text : message_text
            })

            return res.json({
                code : 200,
                status : 'OK',
                newMessage : message
            })
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getAllMessageByConversationId : async (req,res) => {
        try { 
            const { conversation_id } = req.params

            const conversationExist = await Conversation.findByPk(conversation_id)
            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'This conversation does not exist'
                })
            }

            const listMessages = await Message.findAll({
                where : {
                    conversation_id : conversationExist.id
                },
                raw : true
            })

            return res.json({
                code : 200,
                status : 'OK',
                data : listMessages
            })
        } catch (error) {
            catchInternalError(res, error)
        }
    }
}