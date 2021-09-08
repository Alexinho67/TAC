
function addMessage(txt, changer) {
    changer(<ExpireMsg> {txt}</ExpireMsg>)
    setTimeout(() => {
        changer(undefined)
    }, 500);
}

const ExpireMsg = (props) => {
    const styleExpire = {
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#040',
        color: 'white',
        paddingLeft: '50px',
        paddingRight: '50px',
        textAlign: 'center,'
    }

    return (
        <>
            <div style={styleExpire}>
                {props.children}
            </div>
        </>)
}

export { addMessage, ExpireMsg}