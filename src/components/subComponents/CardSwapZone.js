import React from 'react'

const CardSwapZone = ({ idCardSelected, triggerSelectedCardForSwap}) => {
    const [messageInZone, setMessageInZone] = React.useState('1x Karte tauschen')

    function _handleClick() {
        // console.log(`clicked [CardSwapZone]`);
        if (idCardSelected !== -1){
            setMessageInZone('')
            triggerSelectedCardForSwap()
        }
    }

    return (
        <div class="zoneCardSwap" onClick={_handleClick}>
            {messageInZone}
        </div>
    )
}

export default CardSwapZone
