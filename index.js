const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
const { authenticateUser } = require('./controller/user.controller')
const userRoute = require('./route/user.route')


// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors({
    origin : '*'
}))

app.post('/login', authenticateUser)
app.use('/user', userRoute)

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))