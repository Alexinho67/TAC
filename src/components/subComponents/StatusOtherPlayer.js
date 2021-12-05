import React from 'react'
import PlayerStatusSingle from './PlayerStatusSingle'

const StatusOtherPlayer = (  { stateGameReduce } ) => {

    return (<div name={"PlayerStatusOther"}>
        <PlayerStatusSingle pos={'left'} data={stateGameReduce[0]} />
        <PlayerStatusSingle pos={'front'} data={stateGameReduce[1]} />
        <PlayerStatusSingle pos={'right'} data={stateGameReduce[2]} />
    </div>)
}

export default StatusOtherPlayer
