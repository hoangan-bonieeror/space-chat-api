const { Op } = require("sequelize")
const { Group, GroupMembers } = require("../model")

module.exports = {
    createGroup : async ({ creator_id, title }) => {
        const group = Group.build({
            creator_id : creator_id,
            title : title
        })
        return await group.save()
    },
    updateGroup : async (group_id, title) => {
        await Group.update({ title : title }, {
            where : { group_id : group_id  }
        })
    },
    addUserToGroup : async ({ account_id, group_id }) => {
        const member = GroupMembers.build({
            account_id : account_id,
            group_id : group_id
        })
        await member.save()
    },
    getAllUsersByGroupID : async (group_id) => {
        const member_list = await GroupMembers.findAll({
            where : { group_id : group_id }
        })
        return member_list;
    },
    removeUserFromGroup : async (group_id, account_id) => {
        await GroupMembers.destroy({
            where : {
                 [Op.and] : [
                    { group_id : group_id },
                    { account_id : account_id }
                 ]
            }
        })
    }
}