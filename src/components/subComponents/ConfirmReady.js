import React from 'react'
import { GameModelContext } from '../../providers/GameProvider'
import { useSocketContext } from '../../providers/SocketProvider'

const ConfirmReady = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()
    const skipConfirmReady = React.useRef(false)
    const { dispatcherTac } = React.useContext(GameModelContext)
    
    
    React.useEffect(() => {
        if (!socket || !skipConfirmReady.current){ return }
        setTimeout(()=>{    
            clickReady()
        }, 1000)
    }, [socket])

    function clickReady() {
        dispatcherTac({ type: 'setSelfReady' })
        socket.emit('readyToPlay', (resp) => {
            console.log(`[readyToPlay] ACKM: ${resp}`);
            if (resp === 'ok') {
                setIsReady(true)
            }
        })
    }

    return (<>
        {isReady ? <div>Waiting for other players</div>
            : <div id="fieldConfirmReady" onClick={clickReady} tabIndex={1}> READY ?</div>}
    </>)
}

export default ConfirmReady