import React from 'react'
import { GameModelContext } from '../../providers/GameProvider'

const FlagIndicator = ({flag}) => {
    if (flag){
        return (
            <span className="greenLight"></span>
        )
    } else {
        return (
            <span className="redLight"></span>
        )
    }
}

const PlayerStatusDebug = ({player })=>{

    if (!player){ return null}

    return (
        <div style={{marginBottom:'1rem', display:'inline-block',borderBottom:'1px solid black'}}>
        <ul style={{ marginLeft: '3rem' }}>
            <li><strong>name:</strong> {player.name}</li>
            <li><strong>color:</strong> {player.color}</li>
            <li><strong>state:</strong> {player.state}</li>
            <li><strong>posAbs:</strong> {player.posAbs} (type:{typeof(player.posAbs)})</li>
            <li><strong>posRel:</strong> {player.posRel}</li>
            <li><strong>cardForSwap:</strong> {JSON.stringify(player.cardForSwap)}</li>
            <li><strong>cards:</strong>
                <ul style={{ marginLeft: '3rem' }}>
                    {player.cards.map(card => {
                        return (<li>{JSON.stringify(card)}</li>)
                    })}
                </ul></li>
            <li><strong>balls:</strong>
                <ul style={{ marginLeft: '3rem' }}>
                    {player.balls.map(ball => {
                        return (<li>{JSON.stringify(ball)}</li>)
                    })}
                </ul></li>
        </ul>
    </div>)

}

const DebugNew = () => {
    const { stateGameReduce, dispatcherTac } = React.useContext(GameModelContext)
    const [showDebug, setShowDebug] = React.useState(false)

    return (
        <div>
            <button style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => { setShowDebug(f => !f) }}> SHOW / HIDE DEBUG</button>
            {showDebug && 
            <>
            <h2 style={{textAlign:'left'}}>GameState:</h2>
            <ul style={{marginLeft:'3rem'}}>
                <li><strong>gameId:</strong> {stateGameReduce.gameId}</li>
                <li><strong>state:</strong> {stateGameReduce.state}</li>
                <li><strong>subState:</strong> {stateGameReduce.subState}</li>
                <li><strong>posDealerAbs:</strong> {stateGameReduce.posDealerAbs}</li>
                <li><strong>posDealerRel:</strong> {stateGameReduce.posDealerRel}</li>
                <li><strong>numShuffledCards:</strong> {stateGameReduce.numShuffledCards}</li>
                <li><strong>cardPlayedOther:</strong> {JSON.stringify(stateGameReduce.cardPlayedOther)}</li>
                <li><strong>cardsPlayed:</strong> {stateGameReduce.cardsPlayed.length === 0 ? null :
                    <ul style={{marginLeft:'3rem'}}>
                        {stateGameReduce.cardsPlayed.map(card => {
                        return <li>{JSON.stringify(card)}</li>
                    })}</ul>
                    }
                </li>
                <li><strong>rerenderHandCards:</strong> <FlagIndicator flag={stateGameReduce.rerenderHandCards} /> {stateGameReduce.rerenderHandCards.toString()}  </li>
            </ul>
            <h2 style={{ textAlign: 'left' }}> player status:</h2>
            <h3 style={{marginLeft:'1rem', textAlign: 'left' }}> you </h3>
                <PlayerStatusDebug player={stateGameReduce.players[0]} />
            <h3 style={{ marginLeft: '1rem', textAlign: 'left' }}> left </h3>
                <PlayerStatusDebug player={stateGameReduce.players[1]} />
            <h3 style={{ marginLeft: '1rem', textAlign: 'left' }}> front </h3>
                <PlayerStatusDebug player={stateGameReduce.players[2]} />
            <h3 style={{ marginLeft: '1rem', textAlign: 'left' }}> right </h3>
                <PlayerStatusDebug player={stateGameReduce.players[3]} />
                </>}
        </div>
    )
}

export default DebugNew
