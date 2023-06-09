const { Router } = require('express')
const { authenticateUser } = require('../auth/authentication')
const { validatePostLogin } = require('../middlewares/validator')

const router = Router()
router.post('/', validatePostLogin(), authenticateUser)
module.exports = router