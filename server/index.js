const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const socketio = require('socket.io')
const serveStatic = require("serve-static")
const path = require('path')

const {sequelize} = require("./models")

const app = express()

app.use(serveStatic(path.join(__dirname, 'static/SPA')))

//za socket.io
const http = require('http')
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
        allowEIO3: true
    }
})


//pokreni se kad se client spoji
require('./socketio')(io)


app.use(bodyParser.json())
app.use(cors())

//attach all the different endpoints to the express app
require('./routes')(app)

let port = require('./config').PORT
sequelize.sync({force: false}).then(() => {
    server.listen(port)
    console.log("Server started on port: ", port)
})

