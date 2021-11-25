class CardDeck{

    constructor(numTot = undefined){
        this.cards=[]
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
        let numOfCardsPerValue = {} // contains typeOfCard -> total number of this card in the deck
        numOfCardsPerValue[1] = 9 // 9x card #1
        numOfCardsPerValue[2] = 7 // 7x card #2 
        numOfCardsPerValue[3] = 7 // 7x ...
        numOfCardsPerValue[4] = 7 // 7x
        numOfCardsPerValue[5] = 7 // 7x
        numOfCardsPerValue[6] = 7 // 7x
        numOfCardsPerValue[7] = 8 // 8x
        numOfCardsPerValue[8] = 7 // 7x
        numOfCardsPerValue[9] = 7 // 7x
        numOfCardsPerValue[10] = 7 // 7x
        numOfCardsPerValue[12] = 7 // 7x
        numOfCardsPerValue[13] = 9 // 9x
        numOfCardsPerValue[14] = 7 // 7x Trickser
        numOfCardsPerValue[15] = 4 // 4x Tac
     
        let idxContns = 0
        for (let value of Object.keys(numOfCardsPerValue)) {
            // loop through "values" (1,2,3...'Trickser','Tac')
            let numOfCardsThisValue = numOfCardsPerValue[value]
            for (let i = 0; i < numOfCardsThisValue; i++){
                let newCard = { id: idxContns, value: value}
                unShuffledDeck.push(newCard)
                idxContns +=1
            }
        }
        console.log(`Created ${unShuffledDeck.length} cards`)
        return unShuffledDeck
    }
}

module.exports = CardDeck