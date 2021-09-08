let {playerList, Player } = require('../models/playerModel')
let {games, GameTac} = require('../models/gameModel')
const gameController =require('./gameController')

// let io;

// exports.setSocketConnection = (ioFromServerJs) => {
//     io = ioFromServerJs
// }

exports.handleReadyToPlay = (callback, socket) => {
    let pre = '[PlyCtrl-hReady2Play]'
    let playerId = socket.request.session.playerId
    let gameId = socket.request.session.gameId
    Player.findById(playerId).setReady()
    callback("ok")
    // gameReady to start ?
    let game = GameTac.findById(gameId)
    if (game){
        // game.sendPlayerStatus(io)
        game.startGame()
        .then((resp )=>{ 
            // io.in(game.idGame).emit('info', "game is ready. Let's go! ");
            console.log(`${pre}: ${resp}`);
        })
        .catch((resp )=>{
            console.log(`${pre}: ${resp}`);
        })
    } else {
        console.log(`Could not find game with id #${gameId}`);
    }
}
    
exports.setSocket = (idPlayer, socket) =>{
    let ply = Player.findById(idPlayer)
    ply.socket = socket
    console.log(`${ply.name} is joining socket-room ${ply.gameId} `);
    ply.socket.join(ply.gameId)
    gameController.sendPlayerStatus(ply.gameId)
}