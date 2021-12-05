import React from 'react'
import CardSingle from './CardSingle'
import CNST from '../../utils/Constants'
import { v4 as uuidv4 } from 'uuid';

const CardsJSX = ({ name, cards, setCards, transitionCardHandToTray, triggerCardPlayed}) => {

    // const [isSelectedArray, setIsSelectedArray] = React.useState([])
    // const valRand = useRef(randomCards)


    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(( )=>{
        console.log(`%c[CARDS] name="${name}" - INIT useEffect`,'color:#999');
    },[])

    // React.useEffect(() => {
    //     //TODO: clean up this logic.
    //     // card selection algorithm shall only be available for handcards.
    //     // not for played cards in the center of the board
    //     if (setIdCardSelected){ 
    //         let idxSelected = isSelectedArray.indexOf(true)
    //         console.log(`[Cards] name=${name} useEffect@[isSelectedArray] setIdCardSelected(${idxSelected}).isSelectedArray=${isSelectedArray}`);
    //         setIdCardSelected(idxSelected)
    //     }
    // }, [isSelectedArray])

    // React.useEffect( ( )=>{
    //     console.log(`[Cards] name=${name} useEffect@[cards]: Create Array filled with "false"`);
    //     setIsSelectedArray(Array(cards.length).fill(false))
    // }, [cards])
    // }, [])



    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function _updateCardsSelected(cardsArray, cardSlctd){
        // triggered when the card with id has been clicked. 
        // if card is already selected --> set selection state to false
        // if card has not been selected before --> set selection state to true (!) and all other to false
        console.log(`[_updateCardsSelected]states: ${cards.map((card) => { return card.isSelected })}. Card id:${cardSlctd.id}`);
        if (cardSlctd.isSelected === true){
            console.log(`[_updateCardsSelected] - card is already selected --> %cUNselect it`, 'color:#0d0');
            // create a full copy of the array and of each object within it, setting the "isSelected" flag to FALSE
            return cardsArray.map((card)=>{return {...card, isSelected:false}}) 
        } else { // clicked card previously was NOT selected => set "isSelected" flag to TRUE
            console.log(`[_updateCardsSelected] - card is NOT selected yet  --> %cselect it`, 'color:#0d0');
            return cardsArray.map((card) => {
                // if index matches --> set selected state "true"; else set to "false"
                return (card.id === cardSlctd.id) ? { ...card, isSelected: true } : { ...card, isSelected: false }
            })
        }
    }

    function toogleIsSelected(cardSlctd) {
        console.log(`Toggling status of card #${cardSlctd.id}. Current state: %c${cardSlctd.isSelected}`,CNST.RED);
        setCards((cardsArray) => _updateCardsSelected(cardsArray, cardSlctd) )
    }

    function getCardsSingle(){
        let listCards = []
        cards.forEach( (card) => {
            listCards.push(<CardSingle key={card.idExt} card={card}
                                    toogleIsSelected={toogleIsSelected} 
                                    triggerCardPlayed={triggerCardPlayed}
                                    transitionCardHandToTray={transitionCardHandToTray} />)
        })
        return listCards
    }




    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

    return (<div name={name}> 
                { cards.length ? getCardsSingle() : null }
            </div>
    )
    
}

export default CardsJSX
