const { Router } = require('express')
const { createGroup, addMember, getAllMembers, removeMember } = require('../controller/group.controller')
const { validatePostGroup, validateAddMemberToGroup, validateGroupMessage, validategetAllMessageByGroup, validateGetAllMembersByGroupID, validateUpdateGroup, validateRemoveMember } = require('../middlewares/validator')
const { sendMessageOneOnGroup, getAllMessageByGroup } = require('../controller/message.controller')
const validateHandler = require('../middlewares/validateHandler')
const { updateGroup } = require('../service/group.service')

const router = Router()
router.post('/', validatePostGroup(), validateHandler, createGroup)
router.put('/:group_id', validateUpdateGroup, validateHandler, updateGroup)

router.get('/:group_id/members', validateGetAllMembersByGroupID(), validateHandler, getAllMembers)
router.post('/:group_id/members', validateAddMemberToGroup(), validateHandler, addMember)
router.put('/:group_id/members',  validateRemoveMember,validateHandler, removeMember)

router.get('/:group_id/messages', validategetAllMessageByGroup(), validateHandler, getAllMessageByGroup)
router.post('/:group_id/messages', validateGroupMessage(), validateHandler, sendMessageOneOnGroup)
module.exports = router