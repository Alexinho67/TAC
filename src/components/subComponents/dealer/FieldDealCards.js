import React from 'react'
import { useSocketContext } from '../../../providers/SocketProvider';

const FieldDealCards = ({ showDealerField, setShowDealerField, gameState, gameSubState }) => {
    const { socket } = useSocketContext()

    function handleDealCards() {
        console.log(`%c[DealerButton.js]: Clicked -> Requesting cards from server.`, 'color:orange');

        socket.emit('dealCards', (resp) => {
            if (resp === 'ok') {
                console.log(`... 'ok' received.`);
                setShowDealerField(false)
            }
        })
    }

    if (showDealerField && gameState === 'PLAYING' && gameSubState ==='WAIT_FOR_DEAL_REQ' ){
        return (<div id="fieldDealCards" onClick={handleDealCards} tabIndex={1}>
            Deal cards!
        </div>)
    } else {
        return null
    }
}

export default FieldDealCards


