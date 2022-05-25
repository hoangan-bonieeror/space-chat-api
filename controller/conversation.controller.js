const Conversation = require('../model/conversation')
const Participants = require('../model/participant')
const User = require('../model/user')
const { Op } = require("sequelize");
const catchInternalError = require('../utils/catchInternalError')

const isUUID = (value) => {
    return value.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i);
}

module.exports = {
    createConversation : async (req,res) => {
        try {
            const { title } = req.body 
            if(title === undefined || title.length === 0) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : "Conversation must have a name"
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

            const conversatonExist = await Conversation.findOne({ where : {
                [Op.and] : {
                    title : title,
                    creator_id : user_id
                }
            }})
            
            if(conversatonExist !== null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'The user is already created a room with this title'
                })
            }

            const newConversation = await Conversation.create({
                title : title,
                creator_id : user_id
            })

            const firstParticipant = await Participants.create({
                user_id : user_id,
                conversation_id : newConversation.id
            })

            return res.json({
                code : 200,
                status : 'OK',
                msg : 'Created Room Successfully',
                data : {
                    newConversation : newConversation,
                    firstParticipant : firstParticipant
                }
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
    addUserToConversationById : async (req,res) => {
        try {
            const { conversation_id, user_id } = req.params

            const userExist = await User.findByPk(user_id)
            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User does not exist'
                })
            }

            const conversationExist = await Conversation.findByPk(conversation_id)
            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'This conversation does not exist'
                })
            }

            const userExistInRoom = await Participants.findOne({ where : {
                [Op.and] : {
                    user_id : user_id,
                    conversation_id : conversation_id
                }
            } })
            if(userExistInRoom !== null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'This user is already in this room'
                })
            }

            const newParticipant = await Participants.create({
                user_id : userExist.id,
                conversation_id : conversationExist.id
            })

            return res.json({
                code : 200,
                status : 'OK',
                msg : 'Added To Conversation Successfully',
                addedConversation : conversationExist,
                addedMember : newParticipant
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
    leftConversationById : async (req,res) => {
        try {
            const { user_id, conversation_id } = req.params

            const userExist = await User.findByPk(user_id)
            if(userExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User does not exist'
                })
            }

            const conversationExist = await Conversation.findByPk(conversation_id)
            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'This conversation does not exist'
                })
            }

            const userExistInRoom = await Participants.findOne({ where : {
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
                msg : 'Left Successfully',
                updatedParticipant : userExistInRoom
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
    getParticipantsById : async (req,res) => {
        try {
            const { conversation_id  } = req.params
            
            if(isUUID(conversation_id) === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Error type input'
                })
            }
    
            const conversationExist = await Conversation.findByPk(conversation_id)

            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Conversation id does not exist'
                })
            }

            let listParticipants = await Participants.findAll({
                where : {
                    conversation_id : conversation_id
                },
                raw : true
            })

            listParticipants.map(participant => {
                for(let [key, value] of Object.entries(participant)) {
                    if(key.includes('datetime') || key.includes('At') && typeof value === 'object') {
                        console.log(new Date(value).toDateString())
                        participant[key] = (value === null) ? null : new Date(value).toDateString()
                    }
                }
            })
            
            return res.json({
                code : 200,
                status : 'OK',
                data : listParticipants
            })
        } catch(error) {
            catchInternalError(res,error)
        }
    },
    addMultipleUserToConversationById : async (req,res) => {
        try {
            const { conversation_id } = req.params

            if(isUUID(conversation_id) === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'Error type input'
                })
            }

            const conversationExist = await Conversation.findByPk(conversation_id)
            if(conversationExist === null) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'This conversation does not exist'
                })
            }

            let { users } = req.body
            
            const listIdInputUser = users.map(async user => await User.findByPk(user, { raw : true }))
            console.log(listIdInputUser)
  
            let listUserExistInConversation = new Array()
            let listUserAvailableToAdd = new Array()
            await listIdInputUser.forEach(async user => {
                if(user !== null) {
                    (await Participants.findOne({
                        where : {
                            [Op.and] : {
                                user_id : user,
                                conversation_id : conversationExist.id,
                                left_datetime : null
                            }
                        }
                    }) !== null)
                    ? listUserExistInConversation.push(user)
                    : listUserAvailableToAdd.push({
                        user_id : user,
                        conversation_id : conversationExist.id
                    }) 
                }
            })

            const participantsBunch = await Participants.bulkCreate(listUserAvailableToAdd, {
                fields : ['user_id', 'conversation_id']
            })

            return res.json({
                code : 200,
                status : 'OK',
                participantsBunch : participantsBunch,
                listUserExistInConversation : listUserExistInConversation
            })
        } catch (err) {
            catchInternalError(res,err)
        }
    }
}