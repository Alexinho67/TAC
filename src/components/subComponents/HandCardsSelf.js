import React from 'react'
import CardsJSX from './CardsJSX'

const HandCardsSelf = ({ cards, setCards, transitionCardHandToTray, triggerCardPlayed }) => {
    
    return (
        <>
            <CardsJSX name={"handCards"} cards={cards} setCards={setCards}
                transitionCardHandToTray={transitionCardHandToTray}
                triggerCardPlayed={triggerCardPlayed} />
        </>
    )
}

export default HandCardsSelf
