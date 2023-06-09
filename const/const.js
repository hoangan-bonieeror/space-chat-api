const SYNC_DB_MODE = {
    ALTER : 0,
    FORCE : 1
}

const IMAGE_TYPES = {
    PNG : 'png',
    JPG : 'jpg',
    JPEG : 'jpeg'
}

const NON_REQUIRED_AUTHENTICATION = {
    AUTH : 'auth',
    REGISTER : 'register'
}

const JWT_ERROR = {
    EXPIRED : 'TokenExpiredError',
    DECODED : 'JsonWebTokenError'
}

// An half of hour as Miliseconds
const ACCESS_TOKEN_AGE = 1800000
// A day as Miliseconds
const REFRESH_TOKEN_AGE = 86400000

const SEND_MESSAGE_TYPE = {
    ONE_ON_ONE : 0,
    ONE_ON_GROUP : 1
}

const GET_MESSAGE_TYPE = {
    ONE_ON_ONE : 0,
    ONE_ON_GROUP : 1
}

module.exports = {
    SYNC_DB_MODE,
    IMAGE_TYPES,
    NON_REQUIRED_AUTHENTICATION,
    JWT_ERROR,
    ACCESS_TOKEN_AGE,
    REFRESH_TOKEN_AGE,
    SEND_MESSAGE_TYPE,
    GET_MESSAGE_TYPE
}