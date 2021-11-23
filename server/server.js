const path = require('path')
const express = require('express')
const cors = require("cors");
const session = require('express-session')
const { instrument } = require("@socket.io/admin-ui");
const http = require('http')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const colors = require('colors')
const gameController = require('./controllers/gameController')
const playerController = require('./controllers/playerController')


console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

const PORT = (process.env.NODE_ENV === 'production') ? process.env.PORT : 8000
// const  {PORT} = require('./CONSTANTS')

let { wsConnect, stateChatServer } = require('./wsConnect')



//TODO: when development is finished -> set "httpOnly" back to true
let sessionMiddleware = session({
    secret: 'I love superbock',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60, httpOnly: false }
})
app.use(sessionMiddleware)

app.use(express.json()) // @asynchronous post (e.g via axios.post()): be able to use "req.body" in .post method

// app.use(cors({
//     credentials:true,
//     origin: 'http://localhost:3033' 
// }))
app.use(cors())
console.log(``);



app.set('views', path.join(__dirname, 'Views/'))  // first argument "views" is a keyword
app.set('view engine', 'ejs')  // ejs engine


// ROUTES -------------------------------------------------


const my_router = require('./router.js')
app.use('/', my_router)

if (process.env.NODE_ENV === 'production') {
    console.log(colors.red(`run server in PRODUCTION. Serve folder "/build" as static content`));
    app.use(express.static(path.join(__dirname, '../build')))
} else {
    console.log(colors.rainbow(`run server in DEVELOPMENT. redirecting "/" to "/status"`));
    app.use(express.static(path.join(__dirname, './public')))
    app.get('/', (req, res) => {
        // res.redirect('/status')
        let pathString = path.join(__dirname, './public/home.html')
        // let pathString = './public/home.html'
        res.sendFile(pathString)
    })
}


/*
  START WEBSOCKET
*/

const socketIO = require("socket.io");
const server = http.createServer(app)
let flagOnlyAdmin = false
let io;
if (flagOnlyAdmin === true) {
    io = socketIO(server, {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true
        }
    })
} else {
    io = socketIO(server, {
        cors: true,
        origins: ["http://localhost:3000", "https://admin.socket.io"],
        // credentials: true
    })
} // close-else



// namespaceName:'/',

instrument(io, {
    namespaceName: "/admin",
    auth: false });

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
    // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
    // connections, as 'socket.request.res' will be undefined in that case
});


// //TODO: 
// // delete when development is finished 
// io.use((socket, next) => {
//     let c = undefined

//     re = /connect.sid=s%3A(.*?)\..*/
//     try {
//         c = socket.request.headers.cookie.match(re)[1].slice(0, numberOfDigits)
//         socket.data.cookieIdFromHeaders = c

//     } catch (err) {
//         console.error(`[io.use(..) Error: ${err}]`);
//         c = 'undefined'
//     } finally {
//         next()
//     }
// })


console.log(`calling "wsConnect(io)"`);
wsConnect(io)
console.log(`calling "gameController.setSocketConnection(io)"`);
gameController.setSocketConnection(io)
playerController.setSocketConnection(io)

// io.on('connection', (socket) => {
//     console.log(`NEW connection. ID: ${socket.id}`);
// })


// app.listen(PORT, () => console.log(`Server online on page http://localhost:${PORT}\nAdmin: https://admin.socket.io/admin`))
server.listen(PORT, () => console.log(`Server online on page http://localhost:${PORT}\nAdmin: https://admin.socket.io/admin`))

