import React from 'react'
import { Link } from 'react-router-dom'
import { GameModelContext } from '../GameProvider'

const WhiteSpan = (props) => {
    return (<span style={{ color: 'white', fontWeight: 'bold' }} >
            {props.children}
    </span>)
}

const NavBar = () => {

    const model = React.useContext(GameModelContext)

    const resetGameState = () => {
        model.dispatcherTac({ type:'clearState'})
    }

    // TODO: debug only
    const open3Tabs = () => {
        for (let i=0; i<3; i++){window.open('http://localhost:3000', '_blank');}
    }


    return (
        <nav>
            <div style={{ flexGrow: '1' }}>
                {/* <span>name: "{model.playerData.userName}" - pos: "{model.playerData.userPosition}" - color:"{model.playerData.color}"</span> */}
                {/* <span style={{ color: 'white', fontWeight: 'bold' }}>GAME state: {model?.gameStatus?.state}</span> */}
                {/* <br/> <WhiteSpan> GameVariables:{JSON.stringify(gameStatus.stateGameReduce.data)}  </WhiteSpan> */}
                {/* <WhiteSpan> OtherPlayers:
                    {model.stateGameReduce.statusOtherPlayers.map((p,idx) => {
                        return (<li key={idx} style={{fontSize:'0.70rem',fontWeight:'500'}}>{JSON.stringify(p)}</li>)})}  
                </WhiteSpan> */}
                <WhiteSpan>Self: {JSON.stringify(model.stateGameReduce.self, (key, input)=> {
                    if(key ==='idInternal'){ return '...'}
                    else{
                        return input}
                    })}
                </WhiteSpan>
            </div>
            <div>
                <button>REFRESH</button>
            </div>
            <div >
                <p><a href="http://localhost:8000/admin" target="_blank" rel="noreferrer"> ADMIN </a></p>
                <p><a href="/" target="_blank"> NEW TAB </a>  <button onClick={open3Tabs}>3x</button> </p>
                <p><Link to="/" onClick={resetGameState} >HOME</Link></p>
            </div>
        </nav>
    )
}

export default NavBar
