import React from 'react'
import CardsJSX from './CardsJSX'

const HandCardsSelf = ({ cards, setCards, triggerCardPlayed }) => {
    
    return (
        <>
            <CardsJSX name={"handCards"} cards={cards} setCards={setCards}
                triggerCardPlayed={triggerCardPlayed} />
        </>
    )
}

export default HandCardsSelf
