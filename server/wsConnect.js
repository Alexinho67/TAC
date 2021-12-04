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
        
        this.initializeSocketNew()
        // socket.on("setUserName", name => this.handleSetUserName(socket, name))
        // socket.on("createRoom", (userName, clbk) => {
        //     this.handleSetUserName(socket, userName)
        //     this.handleCreateRoom(socket, clbk)
        // })
        // socket.on("joinRoom", (userName, roomName) => {
        //     this.handleSetUserName(socket, userName)
        //     this.handleJoinRom(socket, userName, roomName)
        // })
        // socket.on("leaveRoom", roomName => this.handleLeaveRoom(socket, roomName))
        // socket.on("sendMessage", (msgData) => { this.handleSendMessage(socket, msgData) })
        socket.on("disconnect", () => this.socketCbDisconnect(socket))


        this.gameSocket = new GameSocket(this.socket)
    }

    initializeSocketNew(){
        console.log(`initializeSocketNew`);
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
        } else { // user is unkown
            console.log(`\t[wsConnect.js - initSocketNew] - UNknown user ======================================`.red);
            /*  "visitor" shall be redirected to "home" 
            */
           this.socket.emit('redirectToHome')
        } 
    }


    initializeSocket() {
        console.log(`Init socket for new client (id:${this.socket.id}) ---------------------------------`);
        let userNameSession = this.socket.request.session?.user?.name
        if (userNameSession) { // --> has already user session data
            console.log(`\nKNOWN User is  . ================================`.green)
            console.log(`\t\t His/her name is: "${userNameSession}"`);
            this.reInitKnownUser()
        } else { // user is unkown
            console.log(`\nUNKNOWN user ======================================`.red);
            this.initNewUser()
        }
        // stateChatServer.printListUserIds()
    }


    // handleSetUserName(socket, userName) {
    //     console.log(`\n==> *** SET USER NAME *** => name: "${userName}"`);
    //     socket.request.session.user.name = userName
    //     socket.request.session.save()
    //     console.log(`Setting (socket>request)"session.user" -> idSocket:${socket.id}. Name:${socket.request.session.user.name}`)

    //     let userObj = stateChatServer.findUserBySocketId(socket.id)
    //     if (userObj === undefined) {
    //         console.log(`break`);
    //     }
    //     userObj.name = userName
    //     stateChatServer.printListUserIds()
    //     // this.printFieldsOfSession(socket.request.session)
    // }

    // handleCreateRoom(socket, clbkClient) {
    //     let nameRoomNew = crypto.randomBytes(ROOMLENGTH).toString('hex');
    //     let roomObj = new ChatRoom(nameRoomNew, 99)
    //     stateChatServer.addRoom(roomObj)

    //     this.updateRelationUserAndRoom(socket.id, nameRoomNew, 'add')
    //     let userObj = stateChatServer.findUserBySocketId(socket.id)
    //     console.log(`==> *** CREATE *** User "${userObj.toString()}" is requesting to create a new room => ${nameRoomNew}`);
    //     clbkClient({ name: nameRoomNew }) // literally CALL BACK CLIENT (with new information);) 
    //     socket.join(nameRoomNew)

    // }

    // handleJoinRom(socket, userName, roomNameToJoin) {
    //     let userObj = stateChatServer.findUserBySocketId(socket.id)
    //     console.log(`\n==> *** JOIN *** User "${userObj.toString()}" wants to join room "${roomNameToJoin}"`);
    //     if (roomNameToJoin) { 


    //         let roomObjJoining = stateChatServer.rooms[roomNameToJoin]
    //         if ( roomObjJoining === undefined){
    //             console.log(`\t Room does not exist. Cancelling the JOIN-event`.red);
    //             let flagSuccess = false
    //             socket.emit("joinedRoom", { success: flagSuccess, nameRoom: roomNameToJoin })
    //             return
    //         }

    //         // update WebSocket
    //         socket.join(roomNameToJoin)
    //         socket.emit("joinedRoom", { success: true, nameRoom: roomNameToJoin })


    //         let roomNameAct = userObj.room?.name
    //         let roomNameJoining = roomObjJoining.name
    //         if (roomNameAct && (roomNameAct === roomNameJoining)){
                
    //             // do nothing because user is trying to join room she's currently in
    //             console.log(`User (${userObj.toString()}) is trying to join room "${roomNameJoining}" although currently in room "${roomNameAct}"`);

    //             return
    //         }
        
            
    //         console.log(`User "${userObj.toString()}" is joining room "${roomObjJoining.name}. `,
    //             `Current room: "${roomNameAct}"`.red);

    //         // TODO: 
    //         // once functionality is working fine -> delete this commented section
    //         if (roomNameAct) {
    //             console.log(`\t[handleJoinRom]: found roomNameLeaving=${roomNameAct}. Triggering -> [handleLeaveRoom]"`);
    //             this.handleLeaveRoom(socket, roomNameAct)
    //          }

    //         // add new room to the userObj and add the UserObj to the room 
    //         // this.updateRelationUserAndRoom(socket.id, roomNameToJoin, 'add')
    //         userObj.addRoom(roomObjJoining)

            
    //         roomObjJoining.addUser(userObj)
           
    //         // this.sendAllPreviousMessages(userName, roomObjJoining)

        
    //     } else {
    //         console.error(`\tCannot join room of undefined`);
    //     }
    // }

    // sendAllPreviousMessages(userName, roomObjJoining){
    //     // send all previous messages of that room to the new client/socket
    //     let res = roomObjJoining.getListOfMessages()
    //     if (res.status === 'ok') {
    //         res.data.forEach(msgPrevious => {
    //             if (msgPrevious.sender === userName) {
    //                 msgPrevious = { ...msgPrevious, sender: undefined }
    //             }
    //             this.socket.emit("messageServer", msgPrevious)
    //         })
    //     }

    // }

    // handleLeaveRoom(socket, roomNameLeaving){
    //     let userObj = stateChatServer.findUserBySocketId(socket.id)
    //     console.log(`\n==> *** LEAVE *** User id: ${userObj.idSocket} is leaving room "${roomNameLeaving}"`);
    //     let roomObj = stateChatServer.rooms[roomNameLeaving]
    //     // loop through all the rooms and :
    //     // 1. send an update to users in each room
    //     // 2. remove the user from the chatRoom instance
    //     // send message "user ... left the room"
    //     socket.leave(roomNameLeaving)
        
    //     // store the nameRoom in case user "comes back"
    //     userObj.roomOld = roomNameLeaving
    //     userObj.leaveRoom()
    //     try{
    //         let numUsersRemainging = roomObj.removeUser(userObj.id)
    //         if (numUsersRemainging === 0) {
    //             console.log(`\t --> deleting room`);
    //             delete (stateChatServer.rooms[roomObj.name])
    //         }

    //     }catch(err){
    //         console.log(`err:${err}`);
    //     }
    // }

    // handleSendMessage(socket, msgData) { 
    //     //// msgData = { msg: inputMsg, sender: userName, time: getTimeString() }
    //     let idUser = stateChatServer.findUserBySocketId(socket.id).id
    //     // let msgDataExtended = {...msgData, color: listColor[idUser] }
    //     let msgDataNew = { ...msgData, color: listColor[idUser] }
    //     console.log(`emit("messageServer"): msgData from idUser:${idUser} = ${JSON.stringify(msgDataNew)}`);
    //     socket.to(msgDataNew.roomName).emit("messageServer", msgDataNew)
    //     // let msg = new Message(msgData.msg, msgData.sender, socket.id, msgData.time, msgData.roomName )
    //     stateChatServer.getRoom(msgDataNew.roomName)
    //         .then(room => {
    //             room.addNewMessage(msgDataNew)
    //         }).catch(err => console.log(`error@handelSendMessages: ${err}`))
    //     // stateChatServer.rooms[msgData.roomName].addNewMessage(msgData)
    // }

    socketCbDisconnect(socket) {
        // console.log(`\n==> ***DISCONNECT** user has discconnected from server. \tID:"${socket.id}" `);
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