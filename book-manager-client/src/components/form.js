function FormComponent({ fields, formData, handleChange, handleSubmit, submitButton }) {
    return (
        
        <form onSubmit={handleSubmit} >
            {fields.map((field, index) => (
                <div className='box' key={index}>
                    <label>{field.label}:</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className='input-form'
                    />
                </div>
            ))}
            <div className='sign-container'>
                <button type="submit" className='sign-button'>{ submitButton }</button>
            </div>
        </form>
    );
}

export default FormComponent;
