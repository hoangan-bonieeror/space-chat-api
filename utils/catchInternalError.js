const { ERROR_RESPONSE } = require("./response")

module.exports = (res, error) => {
    const response = {
        ...ERROR_RESPONSE,
        error : error
    }
    return res.status(response.code).json(response)
}