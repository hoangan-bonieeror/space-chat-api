const { Op } = require("sequelize");
const Friendship = require("../model/friendship");

module.exports = {
    postFriendRequest : async (requester_id, addressee_id) => {
        const relationship = Friendship.build({
            requester_id : requester_id,
            addressee_id : addressee_id
        })

        await relationship.save();
    },
    acceptFriendRequest : async (requester_id, addressee_id) => {
        await Friendship.update({ accepted_at : new Date() },
        {
            where : {
                [Op.and] : [
                    { requester_id : requester_id },
                    { addressee_id : addressee_id }
                ]
            }
        })
    },
    getAllUnacceptedRequests : async (requester_id) => {
        const listRequest = await Friendship.findAndCountAll({
            where : {
                [Op.and] : [
                    { addressee_id : requester_id },
                    { accepted_at : { [Op.is] : null } }
                ]
            }
        })

        const { rows } = listRequest

        return rows;
    },
    getAllFriends : async (requester_id) => {
        const listFriends = await Friendship.findAndCountAll({
            where : {
                [Op.and] : [
                    { requester_id : requester_id },
                    { accepted_at : { [Op.not] : null } }
                ]
            }
        })

        const { rows } = listFriends

        return rows;
    },
    deleteFriendship : async (requester_id, addressee_id) => {
        await Friendship.destroy({
            where : {
                [Op.and] : [
                    { requester_id : requester_id },
                    { addressee_id : addressee_id }
                ]
            }
        })
    }
}