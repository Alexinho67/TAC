import React from 'react'
import { GameModelContext } from '../../../providers/GameProvider';
import { useSocketContext } from '../../../providers/SocketProvider';


const delayRemoveHighlightSlots = 2500; // ms
const posStartSlotsBottomPlayer = 
    [{ left: 90, top: 90, pos: 71 },
    { left: 95, top: 90, pos: 72 },
    { left: 90, top: 95, pos: 73 },
    { left: 95, top: 95, pos: 74 }]

const posStartSlotsLeftPlayer = [
    { left: 10, top: 90, pos: 81 },
    { left: 10, top: 95, pos: 82 },
    { left: 5, top: 90, pos: 83 },
    { left: 5, top: 95, pos: 84 }]

const posStartSlotsFrontPlayer = [
    { left: 10, top: 10, pos: 91 },
    { left: 5, top: 10, pos: 92 },
    { left: 10, top: 5, pos: 93 },
    { left: 5, top: 5, pos: 94 }]

const posStartSlotsRightPlayer = [
    { left: 90, top: 10, pos: 101 },
    { left: 90, top: 5,  pos: 102 },
    { left: 95, top: 10, pos: 103 },
    { left: 95, top: 5,  pos: 104 }]

    //HomeSlots
const posAbsHomeSlotsPlayer1 = [
    { left: 49.9, top: 82.20, posAbs: 75 },
    { left: 43.1, top: 70.25, posAbs: 76 },
    { left: 49.9, top: 66.35, posAbs: 77 },
    { left: 56.8, top: 70.25, posAbs: 78 }]
    
const posAbsHomeSlotsPlayer2 = [
    { left: 22,    top: 42,     posAbs: 85 },
    { left: 28.75, top: 46,     posAbs: 86 },
    { left: 28.75, top: 53.85,  posAbs: 87 },
    { left: 22,    top: 57.8,   posAbs: 88 }]

const posAbsHomeSlotsPlayer3 = [
    { left: 50,   top: 17.65, posAbs: 95},
    { left: 56.8, top: 29.5,  posAbs: 96},
    { left: 50,   top: 33.5,  posAbs: 97},
    { left: 43.1, top: 29.5,  posAbs: 98},]

const posAbsHomeSlotsPlayer4 = [
    { left: 78,   top: 57.8, posAbs: 105 },
    { left: 71.3, top: 54,   posAbs: 106 },
    { left: 71.3, top: 46,   posAbs: 107 },
    { left: 78,   top: 42,   posAbs: 108 }]




const BallSlots = ({  resetTimer,setResetTimer, highlightBallSlots, setBallsAllData, ballsAllData}) => {
    const tofRemoveHighlightSlots = React.useRef(undefined) //tof- timeOutFunction
    const { stateGameReduce, dispatcherTac } = React.useContext(GameModelContext)
    const { socket } = useSocketContext()
    const posAllStartSlots = React.useRef(posStartSlotsBottomPlayer
        .concat(posStartSlotsLeftPlayer)
        .concat(posStartSlotsFrontPlayer)
        .concat(posStartSlotsRightPlayer))
    const posHomeSlots = React.useRef(posAbsHomeSlotsPlayer1
        .concat(posAbsHomeSlotsPlayer2)
        .concat(posAbsHomeSlotsPlayer3)
        .concat(posAbsHomeSlotsPlayer4))
    const alphaRot = React.useRef(0)

    React.useEffect(() => {
        
        switch (stateGameReduce.players[0].posAbs){
            case 2:
                alphaRot.current = - Math.PI/2
                break
            case 3:
                alphaRot.current = - Math.PI / 2 * 2
                break
            case 4:
                alphaRot.current = - Math.PI / 2 * 3
                break
            default:  
                alphaRot.current = 0
        }

        console.log(`[BallSlots-UseEffect@Init]. posAbs=${stateGameReduce.players[0].posAbs}. AlphaRot=${alphaRot.current}`);

        posAllStartSlots.current = posAllStartSlots.current.map(slot => {
            let xBallRel = (slot.left - 50) * Math.cos(alphaRot.current) - (slot.top - 50) * Math.sin(alphaRot.current) + 50
            let yBallRel = (slot.left - 50) * Math.sin(alphaRot.current) + (slot.top - 50) * Math.cos(alphaRot.current) + 50
            return Object.assign(slot, { left: xBallRel, top: yBallRel })
        })

        posHomeSlots.current = posHomeSlots.current.map(slot => {
            let xBallRel = (slot.left - 50) * Math.cos(alphaRot.current) - (slot.top - 50) * Math.sin(alphaRot.current) + 50
            let yBallRel = (slot.left - 50) * Math.sin(alphaRot.current) + (slot.top - 50) * Math.cos(alphaRot.current) + 50
            return Object.assign(slot, { left: xBallRel, top: yBallRel })
        })
    }, [])

    React.useEffect(( )=>{
        if (highlightBallSlots===false){
            clearTimeout(tofRemoveHighlightSlots.current)
        }
    }, [highlightBallSlots])

    React.useEffect(( )=>{
        if(resetTimer){
            clearTimeout(tofRemoveHighlightSlots.current)
            setResetTimer(false)
            tofRemoveHighlightSlots.current =
                setTimeout(() => {

                    setBallsAllData(list => list.map(b => {
                        return { ...b, isSelected: false }
                    }))
                },
                    delayRemoveHighlightSlots)
        }
    })
    
    function clickedSlot(e, lft, tp, idxPosSlot=-1){
        e.stopPropagation()
        let ballSelected = ballsAllData.find(ball => ball.isSelected === true)
        if (!ballSelected){return} //if no ball is selected --> stop processing the click event

    /* need to communicate which slot clicked and which ball
        --> provide the dispatcher function with information about:
            - currently selected ball 
            - clicked slot
            - socket ( to communcate change back to the sever)
    */
        dispatcherTac({ type: 'updateBallPosition', payload: { idxPosSlot, ballSelected, socket:socket }   })

        if (tofRemoveHighlightSlots.current){
            clearTimeout(tofRemoveHighlightSlots.current)
        }
        // let elem = e.currentTarget;
        // let leftPos = getComputedStyle(elem).left
        // let topPos = getComputedStyle(elem).top
        console.log(`%c[BallSlot-clicked] - top:${tp} left: ${lft}`,'color:#0af');
        setBallsAllData(ballDataAllOld => {
            return ballDataAllOld.map( (ballData) => {
                // loop through all balls and change position of ball if "isSelected === true"
                if (ballData.isSelected === true) {
                    let updateObj = {left: lft, top: tp}
                    let rtnObj = Object.assign(ballData, updateObj)
                    console.log(`....setting ball #${ballData.id} to pos: ${JSON.stringify(updateObj)}`)
                    return rtnObj
                } else { return ballData}
            } )
        })

        tofRemoveHighlightSlots.current = 
            setTimeout(() => { 

                setBallsAllData(list => list.map(b => {
                     return { ...b, isSelected: false }} ) ) 
                },
            delayRemoveHighlightSlots)
    }

    const classNameHighlightSlot = highlightBallSlots ? 'highlightBallSlot' : ''
    const classNameHighlightSlotStart = highlightBallSlots ? 'highlightBallSlotStart' : ''

    /* =========== DRAW OUTER BALL SLOTS ===========
    /  home slots (4 slots per person) = 16 slots
    / top:      O         right:     O
                                  O
              O   O               O
                O                    O
    */

    const allHomeSlots = posHomeSlots.current.map((slot, i) => {
        let stylePosThisHomeSlot = { left: `${slot.left}%`, top: `${slot.top}%` }

        return (
            <div key={i * 100} className="wrapperBallSlot" style={stylePosThisHomeSlot}>
                <div key={i} onClick={(e) => clickedSlot(e, slot.left, slot.top, slot.posAbs)} className={['ballSlot', classNameHighlightSlot].join(" ")}>
                    {/* {slot.posAbs} */}
                </div>
            </div>)
    })


    /* =========== DRAW OUTER BALL SLOTS ===========
    / idea: create 64 "arms" similiar to hour hand of a clock. Each is 
    / attached to the center of the board.
    / For each slot the 2 "arm" gets rotated a bit
    */ 

    const N = 64
    const rotList = Array.from(Array(N).keys()) // [0,1,2,...63]
    const angleFraction = 360 / N
    const radius = 45.25; //%
    const xCenter = 50
    const yCenter = 49.8
    const allOuterSlots = rotList.map((rot, idxPos) => {
        // let styleThisArm = {transform: `translate(0%,-50%) rotate(${rot * angleFraction}deg)`}
        let alpha = rot * angleFraction * Math.PI / 180 + Math.PI/2 + alphaRot.current ; // adding pi/2 to make first slot the lowest slot
        let topPos = yCenter + radius * Math.sin(alpha)
        let leftPos = xCenter + radius * Math.cos(alpha)
        let stylePosOnRing = { top: `${topPos}%`, left: `${leftPos}%`}

        return (
            <div key={idxPos * 100} className="wrapperBallSlot" style={stylePosOnRing} >
                <div key={idxPos} onClick={(e) => clickedSlot(e, leftPos, topPos, idxPos )} className={['ballSlot', classNameHighlightSlot].join(" ")}>
                    {/* {idxPos} */}
                </div>
            </div>)
    })



    /* =========== DRAW START BALL SLOTS ===========
    /  start slots in each corner(4 slots per person) = 16 slots
    /    __________________
    /   |  O O        O O |
        |  O O        O O |
        |                 |
        |                 |
        |  O O        O O |
        |__O_O________O_O_|                             */
    
    
    const allStartSlots = posAllStartSlots.current.map((slot, i) => {
        let stylePosThisStartSlot = { left: `${slot.left}%`, top: `${slot.top}%` }

        return (
            <div style={{zIndex: '3' }}  key={i*100} className="wrapperBallSlot" style={stylePosThisStartSlot}>
                <div key={i} onClick={(e) => clickedSlot(e, slot.left, slot.top, slot.pos )} className={['ballSlot', classNameHighlightSlotStart].join(" ")}>
                    {/* {slot.pos} */}
                </div>
            </div>)
    })

    return (
        <div name="allSlots">
            <div name="outerBallSlots">
                {allOuterSlots}
            </div >
            <div name="allHomeSlots">
                {allHomeSlots}
            </div>
            <div name="allStartSlots">
                {allStartSlots}
            </div>
            {/* <div style={{backgroundColor:'white', position:'absolute',top:'100%'}}>
                tofRemoveHighlightSlots:{tofRemoveHighlightSlots.current}
                </div> */}
        </div>
    )
}

export default BallSlots
