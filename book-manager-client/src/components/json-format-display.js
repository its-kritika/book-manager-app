function JsonFormat({ jData, errorClass }) {
    return (
        <div className={ `text ${errorClass || ''}`} >
            <pre>{JSON.stringify(jData, null, 2)}</pre> 
        </div>
    )
}

export default JsonFormat