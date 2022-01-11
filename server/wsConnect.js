const playerController = require('./controllers/playerController')
const gameController  = require ('./controllers/gameController')
const { StateChatServer, ChatRoom, User } = require('./modelChatServer.js')

const ROOMLENGTH = 3
const DELAY_DELETE_USER_OBJECT = 10 /*sec*/ * 1000/*msec*/; // x_min * 60sec/min* 1000ms/sec*


let idUser = 0
const getNewId = () => {
    return idUser++
}

let stateChatServer = new StateChatServer()
let chatGeneral = new ChatRoom('general', 99)
stateChatServer.addRoom(chatGeneral)


class GameSocket{
    constructor(socket){
        this.socket = socket
        // this.socket.on("readyToPlay", this.handleReadyToPlay)
        this.socket.on("readyToPlay",(callback)=>{ 
            console.log(`Event:"readyToPlay" }`);
            playerController.handleReadyToPlay(callback, this.socket)
        })
        this.socket.on('playingCard', (card)=>{
            console.log(`Event:"playingCard" - received ${JSON.stringify(card)}`);
            playerController.handlePlayingCard(card, this.socket)
        })
        this.socket.on('swappingCard', (card)=>{
            console.log(`Event:"swappingCard" - received ${JSON.stringify(card)}`);
            playerController.handleSwapCard(card, this.socket)
        })
        this.socket.on('dealCards', (callback)=>{
            console.log(`Event:"dealCards" - received DEALING request`);
            gameController.handleDealRequest(this.socket, callback)
        } )        
        this.socket.on('movedBall', (ballPlayed)=>{
            console.log(`Event:"movedBall" - received "movedBall"-event. Ball:${JSON.stringify(ballPlayed)}`);
            playerController.handleMovedBall(ballPlayed, this.socket)
        } )
    }
}

class Connection {
    constructor(io, socket){
        this.io = io
        this.socket = socket
        
        console.log(`\n===============================================`);
        console.log(`New connection to server. \tID:"${socket.id}"`);

        console.log(`emitting "Hello! Nice to meet you!"`);
        socket.emit('hello','Hello! Nice to meet you!')
        
        this.initializeSocket()
        socket.on("disconnect", () => this.socketCbDisconnect(socket))


        this.gameSocket = new GameSocket(this.socket)
    }

    initializeSocket(){
        console.log(`initializeSocket`);
        let userNameSession = this.socket.request.session?.playerName
        let playerIdSession = this.socket.request.session?.playerId
        let gameIdUrlReq = this.socket.request.headers.referer.split("/").slice(-1)[0]
        let gameIdSession = this.socket.request.session?.gameId
        if (userNameSession && gameIdUrlReq === gameIdSession) { // --> has already user session data
            console.log(`\t[wsConnect.js - initSocketNew] - KNOWN User is  . ================================`.green)
            console.log(`\t\t His/her name is: "${userNameSession}"`);
            let playerIsKnown = playerController.checkIfPlayerIsKnown(playerIdSession)
            if (playerIsKnown){
                playerController.sendUpdateAfterReload(playerIdSession,this.socket)
            }
            playerController.setSocket(playerIdSession, this.socket)
        } else { // user is unknown
            console.log(`\t[wsConnect.js - initSocketNew] - UNknown user ======================================`.red);
            /*  "visitor" shall be redirected to "home" 
            */
           this.socket.emit('redirectToHome')
        } 
    }


    socketCbDisconnect(socket) {
        // console.log(`\n==> ***DISCONNECT** user has disconnected from server. \tID:"${socket.id}" `);
        let userObj = stateChatServer.findUserBySocketId(socket.id)

        if (userObj === undefined) { return }
        userObj.status = 'offline'
        // send info who is still in that room to each client
        let roomNameLeaving = userObj?.room?.name
        if (roomNameLeaving){
            userObj.roomOld = roomNameLeaving
        }

        
        // will delete the userObj after a given waiting period
        console.log(`Setting timer to remove UserObj:(id=${userObj.id},name:${userObj.name}). t=${DELAY_DELETE_USER_OBJECT/1000}sec`);
        userObj.fcnTimeOutRemoveUser = setTimeout( () => {
            this.handleUserDisconnect(socket, userObj, roomNameLeaving)}
            , DELAY_DELETE_USER_OBJECT)

    }

    handleUserDisconnect(socket, userObj, roomNameLeaving){
        /*   function will be executed after user has been 
        *    disconnected from server for longer than a few seconds
        */ 
        console.log(`${DELAY_DELETE_USER_OBJECT/1000}sec have passed -> deleting user:${userObj.toString()} now`);

        if (roomNameLeaving){ this.handleLeaveRoom(socket, roomNameLeaving) }

        try{
            stateChatServer.rooms['general'].removeUser(userObj.id)
            stateChatServer.removeUser(userObj.id)

        }catch(err){
            console.error(`[handleUserDisconnect-ERROR] ${err}`);
        }
    }

    updateRelationUserAndRoom(userIdSocket, roomName, method) {
        // update stateServer object
        let roomObj = stateChatServer.rooms[roomName]
        let userObj = stateChatServer.findUserBySocketId(userIdSocket)

        if (roomObj === undefined){
            console.log(`cannot find room "${roomName}" in stateChatServer.`);
            console.log(`\tKnown rooms: ${Object.keys(stateChatServer.rooms)}`);
        }

        if (method === 'add') {
            // 1. update room instance -> room.users
            roomObj.addUser(userObj)
            // 2. update user instance -> user.rooms
            userObj.addRoom(roomObj)
        } else {//"remove" / "leave"
            try {
                delete (roomObj.users[userObj.id])
                userObj.room = undefined

                let userInChat = roomObj.calcNumUserAct()
                if (userInChat === 0) {
                    delete (stateChatServer.rooms[roomName])
                }
            } catch (err) {
                console.log(err);
            }
        }
    }


} // closing class Connection

const wsConnect = (io) =>{

    gameController.setSocketConnection(io)

    io.on('connection', (socket)=>{
        console.log(`NEW connection`);
        // console.log(` CookieClient (req.headers.cookie) \t is \t${socket.data?.cookieIdFromHeaders}`); 
        // console.log(` CookieServer (socket.request.session.id) is \t${socket.request?.session?.id.slice(0, numberOfDigits)}`);

        new Connection(io, socket)
    })
}

module.exports = { wsConnect, stateChatServer}