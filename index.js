const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')


const app = express();
const { authenticateUser } = require('./auth/authentication')
const authorization = require('./middlewares/authorizeHandler')
const handleRefreshToken = require('./auth/refreshTokenHandler')
const handleLogout = require('./auth/logout')
// const db_connection = require('./utils/db_connection')
// const db_sync = require('./utils/sync_db')
const userRoute = require('./route/user.route')
const conversationRoute = require('./route/conversation.route')
const messageRoute = require('./route/message.route')

const {errorHandler, reqHandler} = require('./middlewares/logHandler')


// const User = require('./model/user')
// const Participants = require('./model/participant')
// const Message = require('./model/message')
// const Conversation = require('./model/conversation')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors({
    origin : '*'
}))
app.use('/' ,express.static(path.join(__dirname, 'views')))
app.use(reqHandler)
app.use(cookieParser())

app.get('/', (req,res) => {
    return res.send(`
        <h1 style="text-align : center; margin-top : 30vh">
            Welcome to space chat application api
        </h1>
    `)
})

app.post('/auth', authenticateUser)
app.use('/refresh', handleRefreshToken)
app.use('/logout', handleLogout)

app.use('/user', authorization,userRoute)
app.use('/conversation', authorization,conversationRoute)
app.use('/message', authorization,messageRoute)

app.all('/*', (req,res) => {
    throw Error(`${req.ip} try to load the ${req.url}`)
})
app.use(errorHandler)

app.listen(process.env.PORT || 3000, async () => {
    // await db_sync(User, Participants, Message, Conversation)
    console.log(`Listening on port ${process.env.PORT || 3000}`)
})