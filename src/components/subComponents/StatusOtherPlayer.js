import React from 'react'

const PlayerStatus = ({ pos, data }) => {
    const styling = {
        position: 'absolute',
        borderRadius: '10px',
        border: '2px solid black',
        color: 'black',
        backgroundColor: '#ddd',
        opacity: '0.8',
        minWidth: '50px',
        minHeight: '2rem',
        transform: 'translate(-50%,-50%)'
    }
    if (pos === 'left') {
        Object.assign(styling, { left: '0', top: '50%' })
    } else if (pos === 'front') {
        Object.assign(styling, { left: '50%', top: '-10%' })
    } else if (pos === 'right') {
        Object.assign(styling, { left: '100%', top: '50%' })
    }
    return (<div style={styling}> <strong>{data.name}</strong> - #{data.posAbs} <br /> {data.status} </div>)
}

const StatusOtherPlayer = ({ stateGameReduce }) => {
    // const userData = React.useContext(UserDataContext)

    return (<>
        <PlayerStatus pos={'left'} data={stateGameReduce[0]} />
        <PlayerStatus pos={'front'} data={stateGameReduce[1]} />
        <PlayerStatus pos={'right'} data={stateGameReduce[2]} />
    </>)
}

export default StatusOtherPlayer
