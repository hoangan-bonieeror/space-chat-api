const { SEND_MESSAGE_TYPE, GET_MESSAGE_TYPE } = require("../const/const");
const { Message, GroupMessage } = require("../model");

module.exports = {
    sendMessage : async (originID, destinationID, msg, typeMessage) => {
        switch (typeMessage) {
            case SEND_MESSAGE_TYPE.ONE_ON_ONE:
                await messageOneOnOne(originID, destinationID, msg);
                break;
            case SEND_MESSAGE_TYPE.ONE_ON_GROUP:
                await messageOneOnGroup(originID, destinationID, msg);
                break;
        }
    },
    getAllMessages : async (accountID, otherID, typeMessage) => {
        let listMessages;
        switch (typeMessage) {
            case GET_MESSAGE_TYPE.ONE_ON_ONE:
                listMessages = await getMessageOneOnOne(accountID, otherID)
                break;
            case GET_MESSAGE_TYPE.ONE_ON_GROUP:
                listMessages = await getMessageOneOnGroup(otherID)
                break;
        }
        return listMessages
    }
}

const getMessageOneOnOne = async (accountID, otherID) => {
    const listMessages = await Message.findAll({ where : { sender_id : accountID, receiver_id : otherID }})
    return listMessages
}

const getMessageOneOnGroup = async (groupID) => {
    const listMessage = await GroupMessage.findAll({ where : { group_id : groupID } })
    return listMessage
}

const messageOneOnOne = async (senderID, receiverID, msg) => {
    const message = Message.build({
        sender_id : senderID,
        receiver_id : receiverID,
        content : msg
    })
    await message.save()
}

const messageOneOnGroup = async (senderID, groupID, msg) => {
    const message = GroupMessage.build({
        sender_id : senderID,
        group_id : groupID,
        content : msg
    })

    await message.save()
}
