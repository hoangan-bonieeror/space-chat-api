const express = require('express')
const controller = require('../controller/user.controller')
const upload = require('../utils/upload')

const router = express.Router()

router.post('/create', upload.single('avatar'), controller.createUser)
router.delete('/:user_id/delete', controller.deleteUser)
router.get('/:user_id/get', controller.getUserById)
router.put('/:user_id/modify', controller.modifyUser)

module.exports = router;
