import React from 'react'

const PlayerStatusSingle = ({ pos, data }) => {
    let styling = {}
    if (pos === 'left') {
        Object.assign(styling, { left: '-1%', top: '65%', transform: "translate(-100%, 0%)"  })
    } else if (pos === 'front') {
        Object.assign(styling, { left: '1%', top: '-1%', transform: "translate(0%, -100%)" })
    } else if (pos === 'right') {
        Object.assign(styling, { left: '101%', top: '1%' })
    }
    return (
        <div style={styling} className={'playerStatusOther'} >
            <strong>{data.name}</strong> <br/> #{data.posAbs} - {data.color} <br /> {data.status} 
        </div>)
}

export default PlayerStatusSingle
