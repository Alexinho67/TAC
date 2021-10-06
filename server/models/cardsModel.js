class CardDeck{

    constructor(numTot = undefined){
        this.getShuffledDeck(numTot)
        // FOR DEBUG PURP

    }

    removeCards(number){
        this.cards = this.cards.splice(0, number)
        console.log(`[CardDeck] Removing  cards from stack. Total number of cards: ${this.cards.length}`);
    }

    getShuffledDeck(numTot = undefined){
        let cardsTemp = this.getSortedDeck()
        for (let i = cardsTemp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = cardsTemp[i];
            cardsTemp[i] = cardsTemp[j];
            cardsTemp[j] = temp;
        }

        this.cards =  cardsTemp
        if (numTot) {
            this.removeCards(numTot)
        }
    }

    getSortedDeck(){
        let unShuffledDeck = []
        let DECK_Description = {} // contains typeOfCard -> total number of this card in the deck
        DECK_Description[1] = 9 // 9x card #1
        DECK_Description[2] = 7 // 7x card #2 
        DECK_Description[3] = 7 // 7x ...
        DECK_Description[4] = 7 // 7x
        DECK_Description[5] = 7 // 7x
        DECK_Description[6] = 7 // 7x
        DECK_Description[7] = 8 // 8x
        DECK_Description[8] = 7 // 7x
        DECK_Description[9] = 7 // 7x
        DECK_Description[10] = 7 // 7x
        DECK_Description[12] = 7 // 7x
        DECK_Description[13] = 9 // 9x
        DECK_Description[14] = 7 // 7x Trickser
        DECK_Description[15] = 4 // 4x Tac
     
        for (let id of Object.keys(DECK_Description)) {
            let tmpArray = Array(DECK_Description[id]).fill(id)
            unShuffledDeck.push(...tmpArray)
        }
        console.log(`Created ${unShuffledDeck.length} cards`)
        return unShuffledDeck
    }
}

module.exports = CardDeck