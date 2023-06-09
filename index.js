const express = require('express')
const cors = require('cors')
const path = require('path')
const { setupUnauthRoute } = require('./utils/setup_route')

const app = express();

// #### Prerequisite Middleware ####
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// #### API middlewares ####
const authorization = require('./middlewares/authorizeHandler')
const {errorHandler, reqHandler} = require('./middlewares/logHandler')
// #### API Routes ####
const userRoute = require('./route/user.route')
const messageRoute = require('./route/message.route')
const groupRoute = require('./route/group.route')
// #### Constants #####
const {NON_REQUIRED_AUTHENTICATION} = require('./const/const')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors({
    origin : '*'
}))
app.use('/' ,express.static(path.join(__dirname, 'views')))
app.use(reqHandler)
app.use(cookieParser())

// Endpoint : Check web server whether do work or not
app.get('/', (_,res) => {
    return res.send(`
        <h1 style="text-align : center; margin-top : 30vh">
            Welcome to space chat application api
        </h1>
    `)
})

// Setup unauthorized endpoint in one line
setupUnauthRoute(app, Object.values(NON_REQUIRED_AUTHENTICATION))

// Setup route
app.use('/user', userRoute)
app.use('/group', authorization, groupRoute)
app.use('/message', authorization, messageRoute)

app.all('/*', (req, _) => {
    throw Error(`${req.ip} try to load the ${req.url}`)
})
// Middleware to catch internal error by previous route
app.use(errorHandler)

app.listen(process.env.PORT || 3000, async () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`)
})