import React from 'react'

const CardSwapZone = ({gameState, gameSubState, idCardSelected, triggerSelectedCardForSwap }) => {
    const [messageInZone, setMessageInZone] = React.useState('1x Karte tauschen')

    function _handleClick() {
        // console.log(`clicked [CardSwapZone]`);
        if (idCardSelected !== -1){
            setMessageInZone('')
            triggerSelectedCardForSwap()
        }
    }

    if (gameState === 'PLAYING' && gameSubState === 'WAIT_FOR_SWAP_CARDS') {
        return (
            <div class="zoneCardSwap" onClick={_handleClick}>
                {messageInZone}
            </div>
        )
    } else {
        return null
    }
            
}

export default CardSwapZone
