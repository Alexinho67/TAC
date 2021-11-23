import { useParams } from 'react-router-dom';
import React from 'react';
import './styles/css/master.css';
import Table from './components/Table';
import { GameModelContext } from './GameProvider';

const IconCopyPaste = ({gameId} )=>{
  return (<i className="fa fa-clone" 
             aria-hidden="true" 
             onClick={() => { navigator.clipboard.writeText(gameId) }}></i>)
}

function Game() {

  let {gameId} = useParams()
  const { stateGameReduce} = React.useContext(GameModelContext)
  return (<> 
            <h2 > game: <span id="gameId">{gameId} </span> &nbsp;       
      <IconCopyPaste gameId={gameId} /> - {stateGameReduce.players[0].name}/#{stateGameReduce.players[0].posAbs}</h2>
            <div className="container">
                <Table/>
            </div>
        </>);
}

export default Game;
