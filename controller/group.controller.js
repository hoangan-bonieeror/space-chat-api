const { validationResult } = require("express-validator")
const { createGroup, addUserToGroup, getAllUsersByGroupID, removeUserFromGroup, updateGroup } = require("../service/group.service")
const catchInternalError = require("../utils/catchInternalError")
const { SUCCESS_RESPONSE } = require("../utils/response")

module.exports = {
    createGroup : async (req, res) => {
        try {
            const creator_id = req.user
            const { title } = req.body
            const body = { creator_id, title }
            const group = await createGroup(body)

            await addUserToGroup({ account_id : creator_id, group_id : group.id })

            let response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            console.log(error)
            catchInternalError(res, error)
        }
    },
    addMember : async (req, res) => {
        try {
            const { group_id } = req.params
            const {
                account_id
            } = req.body

            const body = {account_id, group_id}
            await addUserToGroup(body)

            
            let response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response)
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    getAllMembers : async (req, res) => {
        try {
            const { group_id } = req.params
            const member_list = await getAllUsersByGroupID(group_id);
            let response = {
                ...SUCCESS_RESPONSE,
                data : member_list
            }
            return res.status(response.code).json(response);
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    removeMember : async (req, res) => {
        try {
            const { group_id } = req.params

            const { account_id } = req.body
            await removeUserFromGroup(group_id, account_id)
            let response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response);
        } catch (error) {
            catchInternalError(res, error)
        }
    },
    editGroup : async (req,res) => {
        try {
            const { group_id } = req.params
            const { title } = req.body
            await updateGroup(group_id, title)
            let response = {
                ...SUCCESS_RESPONSE
            }
            return res.status(response.code).json(response);
        } catch (error) {
            catchInternalError(res, error)
        }
    }
}