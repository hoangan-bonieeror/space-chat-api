const { SUCCESS_RESPONSE } = require('../utils/response')
const { sendMessage, getAllMessages } = require('../service/message.service')
const { SEND_MESSAGE_TYPE, GET_MESSAGE_TYPE } = require('../const/const')
const catchInternalError = require('../utils/catchInternalError')
module.exports = {
    sendMessageOneOnOne : async (req, res) => {
        try {
            const sender_id = req.user
            const {
                receiver_id,
                msg
            } = req.body
            
            await sendMessage(sender_id, receiver_id, msg, SEND_MESSAGE_TYPE.ONE_ON_ONE)

            const response = {
                ...SUCCESS_RESPONSE
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    sendMessageOneOnGroup : async (req, res) => {
        try {
            const sender_id = req.user
            const { group_id } = req.params
            const {
                msg
            } = req.body

            await sendMessage(sender_id, group_id, msg, SEND_MESSAGE_TYPE.ONE_ON_GROUP)

            const response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res,error)
        }
    },
    getAllMessageByGroup : async (req, res) => {
        try {
            const { group_id } = req.params
            const listMessage = await getAllMessages(null, group_id, GET_MESSAGE_TYPE.ONE_ON_GROUP)

            const response = {
                ...SUCCESS_RESPONSE,
                data : listMessage
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getAllMessageByOneOnOne : async (req, res) => {
        try {
            const { account_id } = req.query
            const self_id = req.user
            const listMessages = await getAllMessages(self_id, account_id, GET_MESSAGE_TYPE.ONE_ON_ONE)

            console.log(listMessages)

            const response = {
                ...SUCCESS_RESPONSE,
                data : listMessages
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    }
}