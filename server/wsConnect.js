const playerController = require('./controllers/playerController')
const gameController  = require ('./controllers/gameController')

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
            gameController.sendPlayerStatus(gameIdSession)
        } else { // user is unknown
            console.log(`\t[wsConnect.js - initSocketNew] - UNknown user ======================================`.red);
            /*  "visitor" shall be redirected to "home" 
            */
           this.socket.emit('redirectToHome')
        } 
    }

} // closing class Connection

const wsConnect = (io) =>{


    io.on('connection', (socket)=>{
        console.log(`NEW connection`);
        // console.log(` CookieClient (req.headers.cookie) \t is \t${socket.data?.cookieIdFromHeaders}`); 
        // console.log(` CookieServer (socket.request.session.id) is \t${socket.request?.session?.id.slice(0, numberOfDigits)}`);

        new Connection(io, socket)
    })
}

module.exports = { wsConnect}