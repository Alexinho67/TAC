const LENGTH_GAME_IDENTIFYER = 6
const crypto = require("crypto")
const CardDeck = require('./cardsModel')
// const { v4: uuidv4 } = require('uuid');

let games = []

let cardsPerRound = [20,20,20,20,20]
// cardsPerRound = [8, 8]
let nrPlayersNeeded = 4
class GameTac {
    
    constructor() {
        this.players = []
        this.spotsMax = nrPlayersNeeded
        this.state = 'INIT' // INIT -> WAIT FOR OTHER PLAYERS -> WAIT FOR READY -> PLAYING -> FINISHED
        this.subState = 'none'
        this.id = crypto.randomBytes(LENGTH_GAME_IDENTIFYER / 2).toString('hex');
        this.deck = new CardDeck(cardsPerRound.reduce((sum, e) => sum + e, 0))
        this.decksPlayed = 0
        this.cardsTrash = []
        this.round = -1
        this.posDealer = undefined
        this.plyDealer = undefined
        games.push(this)
        console.log(`Games on server:`);
        games.forEach(g => console.log(`\t - ${g.id}: ${g.players.length} players`))
        }

    addPlayer(playerJoin) {
        let ignoreColorCheck = false
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
                    io.to(this.id).emit('gameStart');
                    this.state = 'PLAYING'
                    this.subState = 'WAIT_FOR_DEAL_REQ'
                    this.calcAndInformDealer(io)
                    //TODO: update
                    // dealerName
                    let dealerName = this.plyDealer.name
                    resolve({ msg: `Let's go. Cards are shuffled. "${dealerName}" is the dealer.`})
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
        if ( this.posDealer === undefined) {
            //init dealer in 1st round
            let idxDealer =  Math.floor(Math.random() * nrPlayersNeeded)
            this.posDealer = this.players[idxDealer].position //one-based
        } else {
            let idxDealer = this.posDealer - 1
            idxDealer = (idxDealer + 1) % nrPlayersNeeded // 0...3 for nrPly = 4
            this.posDealer = idxDealer + 1 
        }

        this.plyDealer = this.players.find(p => p.position === this.posDealer)
        console.log(`New dealer is "${this.plyDealer.toString({ flagShort:true })}""`);
        io.to(this.id).emit('newDealer', { pos: this.plyDealer.position, name: this.plyDealer.name })
    }

    dealCards(){   
        /* the model  assigns the new cards to the players instances
         then the current state of each player shall be communicated to the each player(socket)
        */



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
            cardsForThisPlayer.forEach(card => {
                p.cards.push(card)
            })

        })

        // output only ...
        this.players.forEach(p => {
            let stringCards = p.cards.map(c => c.value).join("-")
            console.log(`\t - "${p.name}" received: ${stringCards}`);
        })

        this.state = 'PLAYING'
        this.subState = 'WAIT_FOR_SWAP_CARDS'
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