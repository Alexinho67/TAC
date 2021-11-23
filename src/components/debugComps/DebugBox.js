import React from 'react'
import { v4 as uuidv4 } from 'uuid';
const DebugBox = ({ cnt, idCardPlayed,  idCardSelected, stateInnerCenter, cardsHand, cardsPlayed}) => {

    const styleTable = {
        textAlign: 'center',
        border: '1px solid black',
        fontSize:'.8rem',
    }
    
    return (
        <div className="debug" style={{ zIndex: 1, position: 'fixed', left: '0%', top: '30%' }}>
            {/* {test.current} */}
            <table><tbody>
                <tr><td> idCardPlayed     </td><td> {idCardPlayed !== -1 ? idCardPlayed?.slice(0, 3) : 'none'}</td></tr>
                <tr><td> idCardSelected   </td><td> {idCardSelected !== -1 ? idCardSelected?.slice(0, 3) : 'none'}</td></tr>
                <tr><td> stateInnerCenter </td><td> {stateInnerCenter}</td></tr>
                <tr><td> cardsHand        </td><td> {cardsHand.map(card => { return card.value }).join(",")}</td></tr>
                {/* <tr><td> cardsPlayed      </td><td> {cardsPlayed.map(card => { return card.value })}</td></tr> */}
            </tbody></table>
            <h3> HAND CARDS</h3>
            <table style={styleTable} >
                <tbody style={styleTable} >
                    <tr style={styleTable}><td>id</td><td>selected</td><td> value</td><td> played yet</td></tr>
                    {cardsHand.map(card => {
                        return (<tr key={uuidv4()} style={styleTable}>
                            <td>{card.id.slice(0, 3)} ..</td>
                            <td>{card.isSelected.toString()}</td>
                            <td>{card.value}</td>
                            <td>{card.isPlayed.toString()} </td>
                        </tr>)
                    })}
                </tbody></table>
            <h3> TRAY CARDS</h3>
            <table style={styleTable} >
                <tbody style={styleTable} >
                    <tr style={styleTable}><td>id</td><td>value</td><td>selected</td><td> played yet</td></tr>
                    {cardsPlayed.map(card => {
                        return (<tr key={uuidv4()} style={styleTable}>
                            <td>{card.id.slice(0,3)} ..</td>
                            <td>{card.value} ..</td>
                            <td>{card.isSelected.toString()}</td>
                            <td>{card.isPlayed.toString()} </td>
                        </tr>)
                    })}
                </tbody></table>
        </div>
    )
}

export default DebugBox
