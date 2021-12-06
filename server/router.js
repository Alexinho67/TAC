const express = require('express')
const gameController = require('./controllers/gameController')
const router = express.Router()
const colors = require('colors')
const { PORT } = require('./CONSTANTS')


function temp(req){
    console.log(`sessionData:${JSON.stringify(req.session)}`);
    let userNameSession = req.session?.playerName
    // printFieldsOfSession(socket.request.session)
    if (userNameSession) { // --> has already user session data
        console.log(`\nKNOWN User is  . ================================`.green)
        console.log(`\t\t His/her name is: "${userNameSession}"`);
        let idPlayer = req.session.playerId
        return {name: userNameSession,
                color: req.session.playerColor,
                posAbs: req.session.playerPos,
                gameId: req.session.gameId }

        // 1. identify user and get it's userObj
        // userObj = stateChatServer.users[idUser]
        // 2. create output for debugging
        // if (userObj) {
        //     console.log(`\t[InitSocket]: User is known.IdUser${idUser}.Name: ${userObj.name}.Rooms: ${Object.keys(userObj.roomsSubscribed)} `);
        //     // 3. stop the removal of the userObj (which has been triggered by the disconnect-Event)
        //     userObj.clearRemoveTimeOut()
        //     userObj.idSocket = socket.id
        //     stateChatServer.rooms['general'].addUser(userObj)

        //     // (client does it)// socket.join(userObj.roomOld) // join previous room automatically

        //     let roomObjPrev = stateChatServer.rooms[userObj.roomOld]
        //     if (roomObjPrev) {
        //         // updateRelationUserAndRoom(userObj.idSocket, roomObjPrev.name, 'add')

        //         // send message to all users in that  room
        //         let msgUserJoined = { msg: `${userObj.name} has joined your room ${roomObjPrev.name}`, sender: 'Server', time: getTimeString(), color: colorServer, debug: 'INIT' }
        //         this.socket.to(roomObjPrev.name).emit("messageServer", msgUserJoined)
        //         this.socket.emit("foundSession", {
        //             msg: `Your name is ${userObj.name}`,
        //             nameUser: userObj.name,
        //             nameRoom: roomObjPrev.name
        //         })

        //     }
        //     this.socket.emit("foundSession", {
        //         msg: `Your name is ${userObj.name}`,
        //         nameUser: userObj.name,
        //         nameRoom: undefined
        //     })

        // } else { // what do if there is ACTIVE SESSION, but the userObj has already been deleted
        //     // Destroy session and force reload on client side through io-Socket event    
        //     console.error(`\t UserObj undefined `);
        //     socket.request.session.destroy(() => {
        //         console.log(`!!!!!!! Session has been destroyed`)
        //         socket.emit("reloadPage")
        //     })
        // }


    } else { // user is unkown
        console.log(`\nUNKNOWN user ======================================`.red);
        // userObj = new User()
        // let newId = getNewId()
        // // put the new unique id to both the session and the user Object
        // socket.request.session.user = { name: undefined, id: newId }
        // socket.request.session.save()
        // userObj.id = newId
        // userObj.idSocket = socket.id
        // stateChatServer.rooms['general'].addUser(userObj)
        // stateChatServer.addUser(userObj)
    }
}


router.get('/game/:idgame', (req, res)=>{
    res.redirect('/')
} )

router.get('/initSession', (req, res) => {
    // console.log(`GET /initSession`);
    // res.send('hello')
    let data = temp(req)
    res.json({ msg: `hello from MAIN SERVER (PORT:${PORT})`, ...data })
})

router.get('/admin/:idgame', gameController.displaySingleGame )

router.get('/admin', gameController.displayAllGames)
router.get('/resetState', gameController.reset)

router.post('/newGame',  gameController.createNewGame, gameController.addPlayer )
router.post('/joinGame', gameController.addPlayer)

module.exports = router