import React from 'react'

const DebugBox = ({ cnt, idCardSelected, stateInnerCenter, cardsHand, cardsPlayed}) => {

    const styleTable = {
        textAlign: 'center',
        border: '1px solid black'
    }
    
    return (
        <div className="debug" style={{ zIndex: 1, position: 'fixed', left: '0%', top: '10%' }}>
            {/* {test.current} */}
            <table><tbody>
                <tr><td> cnt              </td><td> {cnt.current} </td></tr>
                <tr><td> idCardSelected   </td><td> {idCardSelected !== -1 ? idCardSelected : 'none'}</td></tr>
                <tr><td> stateInnerCenter </td><td> {stateInnerCenter}</td></tr>
                <tr><td> cardsHand        </td><td> {cardsHand.map(card => { return card.value })}</td></tr>
                <tr><td> cardsPlayed      </td><td> {cardsPlayed.map(card => { return card.value })}</td></tr>
            </tbody></table>
            <h3> HAND CARDS</h3>
            <table style={styleTable} >
                <tbody style={styleTable} >
                    <tr style={styleTable}><td>id</td><td>selected</td><td> played yet</td></tr>
                    {cardsHand.map(card => {
                        return (<tr key={card.id} style={styleTable}>
                            <td>{card.id}</td>
                            <td>{card.isSelected.toString()}</td>
                            <td>{card.isPlayed.toString()} </td>
                        </tr>)
                    })}
                </tbody></table>
            <h3> TRAY CARDS</h3>
            <table style={styleTable} >
                <tbody style={styleTable} >
                    <tr style={styleTable}><td>id</td><td>selected</td><td> played yet</td></tr>
                    {cardsPlayed.map(card => {
                        return (<tr key={card.id} style={styleTable}>
                            <td>{card.id}</td>
                            <td>{card.isSelected.toString()}</td>
                            <td>{card.isPlayed.toString()} </td>
                        </tr>)
                    })}
                </tbody></table>
        </div>
    )
}

export default DebugBox
