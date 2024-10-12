function Error({ e, message }) {
    return (
        <div className={`${e ? `error ${message ? message : ''}` : 'dashboard-error'}`}>
            <p>{ e }</p> 
        </div>
    )
}

export default Error