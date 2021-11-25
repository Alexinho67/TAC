import React from 'react'
import { Link } from 'react-router-dom'
import { GameModelContext } from '../GameProvider'

const WhiteSpan = (props) => {
    return (<span style={{ color: 'white', fontWeight: 'bold' }} >
            {props.children}
    </span>)
}

const NavBar = () => {
    const [showDataOther, setShowDataOther] = React.useState(false)
    const { stateGameReduce, dispatcherTac} = React.useContext(GameModelContext)

    const resetGameState = () => {
        dispatcherTac({ type:'clearState'})
    }

    // TODO: debug only
    const open3Tabs = () => {
        for (let i=0; i<3; i++){window.open('http://localhost:3000', '_blank');}
    }


    return (
        <nav>
            <div style={{ flexGrow: '1' }}>
                <WhiteSpan> Game: state: "{stateGameReduce.state}" - subState: "{stateGameReduce.subState}"
                </WhiteSpan> <br/>
                <WhiteSpan>#{stateGameReduce.players[0].posAbs}-{stateGameReduce.players[0].name}-{stateGameReduce.players[0].color}
                    <ul>{stateGameReduce.players[0].balls.map(ball => <span key={ball.id}> #{ball.id} @{ball.posGlobal} ---</span>)   }</ul>
                </WhiteSpan>    
                <div style={{cursor:'pointer'}} onClick={(e)=>{setShowDataOther(flag => !flag) }}> Others: </div>
                {showDataOther ? stateGameReduce.players.slice(1,4).map(player => {
                    return (<><WhiteSpan> {player.name}:{JSON.stringify(player,undefined,2) } </WhiteSpan> <br/> </>)
                }) : ""}
            </div>
            <div>
                <button>REFRESH</button>
            </div>
            <div > 
                <p><a href="http://localhost:8000/admin" target="_blank" rel="noreferrer"> ADMIN </a></p>
                <p><a href={`http://localhost:8000/admin/${stateGameReduce.gameId}`} target="_blank" rel="noreferrer"> AdminGame </a></p>
                <p><a href="/" target="_blank"> NEW TAB </a>  <button onClick={open3Tabs}>3x</button> </p>
                <p><Link to="/" onClick={resetGameState} >HOME</Link></p>
            </div>
        </nav>
    )
}

export default NavBar
