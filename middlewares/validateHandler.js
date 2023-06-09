const { validationResult } = require("express-validator")
const { BADREQUEST_RESPONSE } = require("../utils/response")

const validateHandler = (req, res, next) => {
    const resultValidation = validationResult(req)
    if(resultValidation.errors.length === 0) {
        return next()
    }

    const response = {
        ...BADREQUEST_RESPONSE,
        msg : 'Invalid Input Data',
        errors : resultValidation.errors
    }
    return res.status(response.code).json(response)
}

module.exports = validateHandler