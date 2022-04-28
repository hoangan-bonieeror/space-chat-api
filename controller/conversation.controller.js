const res = require('express/lib/response')
const Conversation = require('../model/conversation')
const Group_Member = require('../model/group_member')
const User = require('../model/user')
const { Op } = require("sequelize");

module.exports = {
    createConversation : async (req,res) => {
        try {
            const { conversation_name } = req.body 
            if(conversation_name === undefined || conversation_name.length === 0) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : "Name of the conversation can't be left empty"
                })
            }

            const { user_id } = req.params

            const userExist = await User.findByPk(user_id)

            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Id is not exist'
                })
            }

            const listGroup = await Group_Member.findAll({ where : {user_id : userExist.id} })

            listGroup.forEach(group => {
                if(group.conversation_name === conversation_name) {
                    return res.json({
                        code : 400,
                        status : 'Bad Request',
                        msg : 'A user is not allow to create 2 rooms with the same name'
                    })
                }
            })

            const newConversation = await Conversation.create({
                conversation_name : conversation_name
            })
            const newGroupMem = await Group_Member.create({
                user_id : userExist.id,
                conversation_id : newConversation.id
            })

            return res.json({
                code : 200,
                status : 'OK',
                msg : 'Created Room Successfully',
                newConversation : newConversation,
                firstMember : newGroupMem
            })
        } catch (error) {
            console.log(error)
            return res.json({
                code : 500,
                status : 'Internal Error System',
                msg : 'Something went wrong'
            })
        }
    },
    addToRoomById : async (req,res) => {
        try {
            const { conversation_id, user_id } = req.params

            const conversationExist = await Conversation.findByPk(conversation_id)

            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Conversation does not exist'
                })
            }

            const userExistInRoom = await Group_Member.findOne({ where : { user_id : user_id } })
            if(userExistInRoom !== null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User is already in this room'
                })
            }

            const userExist = await User.findByPk(user_id)

            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User does not exist'
                })
            }

            const newGroupMem = await Group_Member.create({
                user_id : userExist.id,
                conversation_id : conversationExist.id
            })

            
            return res.json({
                code : 200,
                status : 'OK',
                msg : 'Added To Room Successfully',
                addedConversation : conversationExist,
                addedMember : newGroupMem
            })
            
        } catch(error) {
            console.log(error)
            return res.json({
                code : 500,
                status : 'Internal Error System',
                msg : 'Something went wrong'
            })
        }
    },
    leftFromRoomById : async (req,res) => {
        try {
            const { user_id, conversation_id } = req.params

            const conversationExist= await Conversation.findByPk(conversation_id)
            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Conversation does not exist'
                })
            }

            
            const userExist = await User.findByPk(user_id)
            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User does not exist'
                })
            }

            const userExistInRoom = await Group_Member.findOne({ where : {
                [Op.and]: [
                    { user_id : userExist.id },
                    { conversation_id : conversationExist.id },
                    { left_datetime : null }
                ] 
            }})
            
            if(userExistInRoom === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User does not exist in this room'
                })
            }

            await userExistInRoom.update({ left_datetime : Date.now()})
            return res.json({
                code : 200,
                status : 'OK',
                msg : 'Left Successfully'
            })
        } catch(error) {
            console.log(error)
            return res.json({
                code : 500,
                status : 'Internal Error System',
                msg : 'Something went wrong'
            })
        }
    }
}