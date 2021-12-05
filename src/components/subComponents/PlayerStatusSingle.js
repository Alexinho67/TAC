import React from 'react'

const PlayerStatusSingle = ({ pos, data }) => {
    let styling = {}
    if (pos === 'left') {
        Object.assign(styling, { left: '-30%', top: '75%' })
    } else if (pos === 'front') {
        Object.assign(styling, { left: '30%', top: '-10%' })
    } else if (pos === 'right') {
        Object.assign(styling, { left: '130%', top: '30%' })
    }
    return (
        <div style={styling} className={'playerStatusOther'} >
            <strong>{data.name}</strong> - #{data.posAbs} - {data.color} <br /> {data.status} <br />
            {/* <ul style={{fontSize:'0.5rem', marginLeft:'1rem'}}>
                {data.balls.map(ball=> <li>{JSON.stringify(ball)}</li> )}
            </ul> */}
        </div>)
}

export default PlayerStatusSingle
