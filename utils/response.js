const SUCCESS_RESPONSE = {
    code : 200,
    status : 'Successfully'
}
const ERROR_RESPONSE = {
    code : 500,
    status : 'Interal Server Error'
}

const UNAUTHORIZED_RESPONSE = {
    code : 401,
    status : 'Unauthorized'
}

const FORBIDDEN_RESPONSE = {
    code : 403,
    status : 'Forbidden'
}

const BADREQUEST_RESPONSE = {
    code : 400,
    status : 'Bad Request'
}

module.exports = {
    SUCCESS_RESPONSE,
    ERROR_RESPONSE,
    UNAUTHORIZED_RESPONSE,
    FORBIDDEN_RESPONSE,
    BADREQUEST_RESPONSE
}
