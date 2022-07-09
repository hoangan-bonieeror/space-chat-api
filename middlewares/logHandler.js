const fs = require('fs');
const fsPromises = require('fs').promises
const path = require('path')
const { v4 : uuid } = require('uuid')
const { format } = require('date-fns')

const logEvents = async (msg, logType) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logString = `${dateTime}\t${uuid()}\t${msg}`

    try {
        !fs.existsSync(path.join(__dirname, '..' ,'logs')) && await fsPromises.mkdir(path.join(__dirname, 'logs'))

        await fsPromises.appendFile(path.join(__dirname, '..' ,'logs', logType), '\n' + logString)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    errorHandler : (error, req, res, next) => {
        logEvents(`${error.name} : ${error.message}`, 'errLog.txt')
        console.error(error.stack);
        res.redirect(path.join(__dirname, '404.html'))
    }, 
    reqHandler : (req, res, next) => {
        logEvents(`${req.ip} ${req.method} ${req.url}`, 'reqLog.txt')
        next()
    }
}