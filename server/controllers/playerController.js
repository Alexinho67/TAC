let {playerList, Player } = require('../models/playerModel')
let {games, GameTac} = require('../models/gameModel')
const gameController =require('./gameController')

let io;

exports.setSocketConnection = (ioFromServerJs) => {
    io = ioFromServerJs
}

exports.handleSwapCard = (cardForSwap, socket) => {
    let pre = '[PlyCtrl-handleSwapCard]'
    let playerId = socket.request.session.playerId
    let plyGive = Player.findById(playerId)
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    
    // 2.update players instances
    plyGive.cardSwapGive = cardForSwap
    let idxPlayerGiver = plyGive.position - 1  
    let idxPlayerReq
    if (game.spotsMax === 4) {// give card to "opposite" player
        idxPlayerReq = (idxPlayerGiver + 2) % 4
    } else {
        idxPlayerReq = (idxPlayerGiver + 1) % game.spotsMax
        // 2-players: 
        // posGiver = 1  =>  idxReq = (1 - 1 + 1 ) % 2 = 1
        // posGiver = 2  =>  idxReq = (2 - 1 + 1 ) % 2 = 0
    } 
    let plyReq = game.players[idxPlayerReq]
    plyReq.cardSwapRecvd = cardForSwap
    // 1.output for debug
    let listCardsForSwapReqd = game.players.reduce( (listOld, player) => {
        if (player.cardSwapGive){
            listOld.push(player.cardSwapGive)
        } 
        return listOld
    }, [])
    console.log(pre + `listCardsForSwapReqd: ${JSON.stringify(listCardsForSwapReqd)}`);


    // 4.inform other players about the played card
    // io.to(game.id).emit('serverPlayedCard', cardPlayedModd)
    plyGive.socket.to(game.id).emit('playerSelectedCardForSwap', { posAbsPlayer: plyGive.position} )

    // check if all players selected a card
    if (game.players.every(p => p.cardSwapGive !== undefined)){
        
        setTimeout(( )=>{
            // each player has selected a card for the swap
            game.players.forEach(p => {
                console.log(pre + ` ${p.name} is receiving card ${JSON.stringify(p.cardSwapRecvd)}`);
                io.to(p.socket.id).emit('serverCardSwapRecvd', p.cardSwapRecvd)
                // reset the cardForSwap property of each player
                p.cardSwapGive = undefined
                p.cardSwapRecvd = undefined
            })

            game.state = 'PLAYING'
            game.subState = 'WAIT_FOR_ALL_CARDS_PLAYED'
            
        }, 1000)
    }
}

exports.handlePlayingCard = (cardPlaying, socket) => {
    let pre = '[PlyCtrl-hndlPlyingCard]'
    let playerId = socket.request.session.playerId
    let ply = Player.findById(playerId)
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    let cardPlayedModd = { playedByName: ply.name, playedByPosAbs: ply.position , value: cardPlaying.value }
    // 1.output for debug
    console.log(`${pre} %c${ply.name} is playing ${JSON.stringify(cardPlaying)}`,'color:pink');
    // 2.update player instance
    ply.cards = ply.cards.filter(card => card.id !== cardPlaying.id)
    // 3.update game instance
    game.cardsTrash.push(cardPlayedModd)
    // 4.inform other players about the played card
    // ply.socket.to(game.id).emit('serverPlayedCard', cardPlayedModd)
    socket.to(game.id).emit('serverPlayedCard', cardPlayedModd)

    // 5.check if all cards have been played
    let sumHandCards = game.players.reduce((old, ply) => { return old + ply.cards.length }, 0)
    console.log(`${sumHandCards} left to play...`);
    if(sumHandCards === 0){
        console.log(`Each player has played his/her hand cards.`)
        game.calcAndInformDealer(io)
        // inform all players about who is the new dealer
    }
}

exports.handleMovedBall = (ballPlayed, socket) => {
    let pre = '[PlyCtrl-hndlPlyingCard]'
    let playerId = socket.request.session.playerId
    let plyMovingBall = Player.findById(playerId)
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    let ballMovedMod = { namePlayedBy: plyMovingBall.name, 
                         posPlayedBy:  plyMovingBall.position , 
                         posPlayerOwner: ballPlayed.posOwner ,
                         id: ballPlayed.id, 
                         pos: ballPlayed.pos}
    // 1.output for debug
    console.log(`${pre} %c${plyMovingBall.name} has moved ball ${JSON.stringify(ballPlayed)}`, 'color:pink');
    // 2.update player instance
    let playerOwner = game.players.find(p => p.position === ballMovedMod.posPlayerOwner )
    playerOwner.balls = playerOwner.balls.map( ball => {
        // update position of moved/played ball
        if(ball.id !== ballPlayed.id) {return ball}
        else{
            ball.position = ballPlayed.pos
            return ball
         }
    })
    // 3.inform other players about the moved ball
    plyMovingBall.socket.to(game.id).emit('serverMovedBallByOther', ballMovedMod)

}

exports.handleReadyToPlay = (callback, socket) => {
    let pre = '[PlyCtrl-hReady2Play]'
    let playerId = socket.request.session.playerId
    let ply  = Player.findById(playerId)
    if(ply === undefined){
        console.log(`%cCouldn't find player with id: ${playerId}`,'color:red');
        return
    }
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    ply.setReady()
    callback("ok")
    console.log(`${pre} "${ply.name} is ready."`);
    game.sendPlayerStatus(io)
    // gameReady to start ?
    if (game){
        // game.sendPlayerStatus(io)
        game.startGame(io)

        .then((resp )=>{ 
            console.log(`${pre}: ${resp.msg}`);
            io.to(game.id).emit('info', resp.msg);  
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