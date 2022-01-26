import React from 'react'

const Footer = () => {
    return (
        <div className="footer">
            creator: <strong>Alexander Knoch</strong> &copy; {new Date().getFullYear()}<br />
            rules of TAC: 
            <a href="https://shop.spiel-tac.de/spielanleitungen" target="_blank" rel="noopener noreferrer">
                https://shop.spiel-tac.de/spielanleitungen
             </a>
        </div>
    )
}

export default Footer
