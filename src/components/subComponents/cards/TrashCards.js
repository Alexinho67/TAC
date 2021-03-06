import React from 'react'
import { GameModelContext } from '../../../providers/GameProvider'
import CardsJSX from './CardsJSX'

const TrashCards = ({width}) => {

    const { stateGameReduce} = React.useContext(GameModelContext)
    const [cardsTrash, setCardsTrash] = React.useState([])

    React.useEffect(() => {
        console.log(`[TrashCards- useEffect@ stateGameRedude.cardsPlayed] Mdl.cardsPlayed:${JSON.stringify(stateGameReduce.cardsPlayed)}`);
        if (stateGameReduce.cardsPlayed.length > 0 ){
            let lastCardMdl = stateGameReduce.cardsPlayed.slice(-1)[0]
            let lastCardRender = {idExt: lastCardMdl.idExt,
                                left: 50,
                                top: 50,
                                width: width,
                                value: lastCardMdl.value,
                                isPlayed:true,
                                isCardForSwap: false,
                                isSelected: false,
                                inTrash:true}  
            setCardsTrash([lastCardRender])
        }
    }, [stateGameReduce.cardsPlayed])
    


    return (
        <div name="wrapperCardTrash" >
            <CardsJSX name={"trashCards"} cards={cardsTrash} />
        </div>
    )
}

export default TrashCards
