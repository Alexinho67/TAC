import React from 'react'
import { GameModelContext } from '../../GameProvider'
import { useSocketContext } from '../socketComps/SocketProvider'

const stylePosAll = {
        center: { top: '50%', left: '50%'},
        self: { top: '94%', left: '80%' },
        left: { top: '80%', left: '06%'},
        front: { top: '6%', left: '20%'},
        right: { top: '20%', left: '94%'}
    }

const FieldDealCards = ({ setIAmDealer} )=>{
    const { socket } = useSocketContext()

    function handleDealCards() {
        console.log(`%c[DealerButton.js]: Clicked -> Requesting cards from server.`,'color:orange');
        
        socket.emit('dealCards', (resp)=>{
            if(resp === 'ok'){
                console.log(`... 'ok' received.`);
                setIAmDealer(false)
            }
        })
    }
    return (<div id="fieldDealCards" onClick={handleDealCards} tabIndex={1}>
        Deal cards!
    </div>)
}

const DealerButton = () => {

    const {stateGameReduce} = React.useContext(GameModelContext)
    const { posDealerRel } = stateGameReduce
    const [iAmDealer, setIAmDealer] = React.useState(false)


    React.useEffect(() => {
        let flagDealer = posDealerRel === 'self'
        setIAmDealer(flagDealer)
    }, [stateGameReduce.posDealerRel])

    const stylePos = React.useRef(stylePosAll.center)

    function getStyle(posDealerRel){
        if (posDealerRel === undefined){
            return stylePosAll.center
        } else {
            return stylePosAll[posDealerRel]
        }
    }

    stylePos.current = getStyle(posDealerRel)
    stylePos.current = { ...stylePos.current, transition: 'all 1s' }

    return (<>
        <div style={stylePos.current} id="dealerButton" className="center">
        </div>
        {iAmDealer ? <FieldDealCards setIAmDealer={setIAmDealer} />: null}
    </>
    )
}

export default DealerButton
