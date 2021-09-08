let {games, GameTac} = require('../models/gameModel')
const {Player} = require('../models/playerModel') 
const ioDebug = require('./ioDebug')

let io;

exports.setSocketConnection = (ioFromServerJs) => {
    io = ioFromServerJs
}

exports.sendPlayerStatus = (idGame) =>{
    let game = GameTac.findById(idGame)
    let sockets = ioDebug.getSocketsInRoom(io, idGame)
    console.log(`Sockets in room "${idGame}":${sockets}`);

    let message = game.getStatusAllPlayers()
    console.log(`Sending: ${JSON.stringify(message)}`);
    
    let socketsInRoom = io.sockets.adapter.rooms.get(idGame)
    console.log(`Sockets in room:"${idGame}": ${Array.from(socketsInRoom)}`);


    console.log(`[gameController.sendPlayerStatus()]`);

    game.sendPlayerStatus(io)

}

exports.createNewGame = (req, res, next) => {
    console.log(`req.body:${req.body}`);
    console.table(req.body);
    let gameNew = new GameTac()
    let url = `/game/${gameNew.id}`
    console.log(`newGame requested. Redirecting to "${url}"`);
    
    req.session.gameId = gameNew.id
    req.session.save(( )=>{ 
        next()
    })
}

exports.reset = (req, res) => {
    while (games.length) {
        games.pop();
    }
    console.log(`Resetting game state`);
    res.status(200).end()
}

exports.displayAllGames = (req, res) => {
    res.render('GameStatus', {games: games})
}

exports.addPlayer = (req, res) =>{
    console.log(`[GameCtlr-AddPlayer]`);
    let { userName, userColor, userPosition } = req.body
    
    let gameIdJoining
    if (req.url.includes('joinGame')) {
        let { gameId} = req.body
        gameIdJoining = gameId
        
    } else {
        gameIdJoining = req.session.gameId
    }
    
    let player = new Player(userName, userColor, userPosition, gameIdJoining)
    let game = GameTac.findById(gameIdJoining)
    if (game === undefined) {
        res.status(404)
        res.json({ room: null, msg: `Room with id ${gameIdJoining} not found` })
        return
    }
    game.addPlayer(player)

    req.session.playerId = player.id;
    req.session.gameId = gameIdJoining;
    req.session.save(() => {
        res.json({ room: game.id, msg: `Joining room with id ${game.id}.` })
    })
}