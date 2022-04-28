const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
const { authenticateUser } = require('./controller/user.controller')
const userRoute = require('./route/user.route')
const conversationRoute = require('./route/conversation.route')


// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors({
    origin : '*'
}))

app.get('/', (req,res) => {
    return res.send(`
        <h1 style="text-align : center; margin-top : 30vh">
            Welcome to space chat application api
        </h1>
    `)
})
app.post('/login', authenticateUser)
app.use('/user', userRoute)
app.use('/conversation', conversationRoute)

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))