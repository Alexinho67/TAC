const LENGTH_GAME_IDENTIFYER = 6
const crypto = require("crypto")
const CardDeck = require('./cardsModel')
// const { v4: uuidv4 } = require('uuid');

let games = []

let cardsPerRound = [20,20,20,20,20]
cardsPerRound = [8, 8]
let nrPlayersNeeded = 4   


class GameTac {
    
    constructor() {
        this.players = []
        this.state = 'INIT' // INIT -> WAIT FOR OTHER PLAYERS -> WAIT FOR READY -> PLAYING -> FINISHED
        this.subState = 'none'
        this.id = crypto.randomBytes(LENGTH_GAME_IDENTIFYER / 2).toString('hex');
        this.deck = new CardDeck(cardsPerRound.reduce((sum, e) => sum + e, 0))
        this.decksPlayed = 0
        this.cardsTrash = []
        this.round = -1
        this.idxDealer = undefined
        games.push(this)
        console.log(`Games on server:`);
        games.forEach(g => console.log(`\t - ${g.id}: ${g.players.length} players`))
        }

    addPlayer(playerJoin) {
        let ignoreColorCheck = true
        return new Promise((resolve, reject)=>{
            if (this.players.length === 4){
                reject('Game already has 4 players')
                return
            } else if (!ignoreColorCheck && this.players.find(p => p.color === playerJoin.color)){
                reject(`Color ${playerJoin.color} is already taken`)
                return
            } else if (this.players.find(p => p.position === playerJoin.position)) {
                reject(`Position ${playerJoin.position} is already taken`)
                return
            } else{
                this.players.push(playerJoin)
                this.state = (this.players.length < nrPlayersNeeded) ?
                    'WAIT_FOR_OTHER_PLAYERS'
                    : 'WAIT_FOR_READY'
                resolve('ok')
            }
        })   
    }

    startGame(io){
        return new Promise( (resolve, reject)=>{
            if (this.players.length < nrPlayersNeeded){
                reject(`Cannot start game. Only ${this.players.length}/${nrPlayersNeeded} players at the table`)
            } else{
                this.state = 'WAIT_FOR_READY'
                this.players.forEach(p => console.log(`\t ${p.name}: ${p.isReady? 'is ready': 'is NOT ready'}`))
                let plyrsNotReady = this.players.filter(p => p.isReady === false)
                if (plyrsNotReady.length > 0){
                    reject(`Cannot start game. ${plyrsNotReady.map(p => p.name)} are not ready yet.`)
                } else {
                    this.state = 'PLAYING'
                    this.subState = 'waitForDealReq'
                    this.calcAndInformDealer(io)

                    resolve({ msg: `Let's go. Cards are shuffled. "${this.players[this.idxDealer].name}" is the dealer.`})
                }                
            }
         })
    }

    getStatusAllPlayers(){
        return this.players.map(p => {
            return p.getStatus()
        })
    }

    calcAndInformDealer(io){
        if ( this.idxDealer === undefined) {
            //init dealer in 1st round
            this.idxDealer = Math.floor(Math.random() * nrPlayersNeeded) //zero-based
        } else {
            this.idxDealer = (this.idxDealer + 1) % nrPlayersNeeded
        }
        let plyObjDealer = this.players[this.idxDealer]
        console.log(`New dealer is "${plyObjDealer.toString(true)}""`);
        io.to(this.id).emit('newDealer', { pos: plyObjDealer.position, name: plyObjDealer.name })
    }

    dealCards(){   
        // the model  assigns the new cards to the players instances
        // then the current state of each player shall be communicated to the each player(socket)
        
        // if the shuffled deck is finished --> create a new one
        console.log(`[gameMdl] cards in deck: "${this.deck.cards.length}"`);
        if (this.deck.cards.length === 0) {
            console.log(`[GameMdl] shuffling cards...`);
            this.deck.getShuffledDeck()
            this.round = -1
        }

        this.round = this.round + 1 //! it is zero-based. this.round init's with "-1".
        let cardsThisRound = cardsPerRound[this.round]
        console.log(`Round#${this.round}.Dealing ${cardsThisRound} cards.`);

        // get X shuffled cards for this round from the deck
        let cardsDealing = this.deck.cards.splice(0, cardsThisRound)

        // assign N cards to each player instance 
        this.players.forEach(p => {
            let cardsForThisPlayer = cardsDealing.splice(0, cardsThisRound / 4)
            cardsForThisPlayer.forEach((valueCard,idx) => {
                p.cards.push({id:idx, value:valueCard})
            })

        })

        // output only ...
        this.players.forEach(p => {
            let stringCards = p.cards.map(c => c.value).join("-")
            console.log(`\t - "${p.name}" received: ${stringCards}`);
        })

       
    }

    sendPlayerStatus(io){
        console.log(`[gameModel.sendPlayerStatus()]`);
        let message = this.getStatusAllPlayers()
        console.log(`{io.in(${this.id}).emit("playerStatus")} => Sending: `)
        message.forEach(m => console.log(`\t - ${JSON.stringify(m)}`))
        let fb = io.to(this.id).emit('playerStatus', { message });
        console.log(`....retun value: ${fb}`);
        console.log(`........sended(from gameController)`);
    }

    static findById(idGame) {
        return games.find(g => g.id === idGame)
    }
}


module.exports = { GameTac, games}