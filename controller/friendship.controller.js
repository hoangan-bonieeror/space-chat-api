const { postFriendRequest, getAllUnacceptedRequests, getAllFriends, deleteFriendship, acceptFriendRequest } = require("../service/friendship.service")
const userService = require("../service/user.service")
const catchInternalError = require("../utils/catchInternalError")
const { SUCCESS_RESPONSE } = require("../utils/response")

module.exports = {
    sendRequestHandler : async (req, res) => {
        try {
            const requester_id = req.user
            const { addressee_id } = req.body
            const user = await userService.getAccountInfo(requester_id);
            await postFriendRequest(user.id, addressee_id)

            let response = {
                ...SUCCESS_RESPONSE
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    acceptRequestHandler : async (req, res) => {
        try {
            const requester_id = req.user
            const { addressee_id } = req.params
            const user = await userService.getAccountInfo(requester_id);
            await acceptFriendRequest(user.id, addressee_id)
            let response = {...SUCCESS_RESPONSE}
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getAllUnacceptedRequestsHandler : async (req, res) => {
        try {
            const requester_id = req.user
            const user = await userService.getAccountInfo(requester_id);
            const listRequests = await getAllUnacceptedRequests(user.id)


            let response = {
                ...SUCCESS_RESPONSE,
                data : listRequests
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getAllFriendsHandler : async(req, res) => {
        try {
            const requester_id = req.user
            const user = await userService.getAccountInfo(requester_id);
            const listFriends = await getAllFriends(user.id)

            let response = {
                ...SUCCESS_RESPONSE,
                data : listFriends
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    removeRequestHandler : async(req, res) => {
        try {
            const requester_id = req.user
            const { addressee_id } = req.params
            const user = await userService.getAccountInfo(requester_id);
            await deleteFriendship(user.id, addressee_id)

            let response = {
                ...SUCCESS_RESPONSE
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    destroyFriendshipHandler : async (req, res) => {
        try {
            const requester_id = req.user
            const { addressee_id } = req.params
            const user = await userService.getAccountInfo(requester_id);
            await deleteFriendship(user.id, addressee_id)

            let response = {
                ...SUCCESS_RESPONSE
            }

            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    }
}