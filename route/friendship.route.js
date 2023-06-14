const { Router } = require('express')
const { sendRequestHandler, getAllUnacceptedRequestsHandler, getAllFriendsHandler, removeRequestHandler, destroyFriendshipHandler, acceptRequestHandler } = require('../controller/friendship.controller')
const { validateSendRequest, validateAcceptRequest, validateRemoveRequest } = require('../middlewares/validator')
const validateHandler = require('../middlewares/validateHandler')

const router = Router()

router.post('/request', validateSendRequest(), validateHandler, sendRequestHandler)
router.post('/request/:addressee_id', validateAcceptRequest(), validateHandler, acceptRequestHandler)
router.get('/request', getAllUnacceptedRequestsHandler)
router.delete('/request/:addressee_id',  validateRemoveRequest(), validateHandler, removeRequestHandler)

router.get('/friend', getAllFriendsHandler)
router.delete('/friend/:addressee_id', validateRemoveRequest(), validateHandler, destroyFriendshipHandler)

module.exports = router;