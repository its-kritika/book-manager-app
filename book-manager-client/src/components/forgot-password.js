import { useState } from 'react';
import FormComponent from './form'
import axios from 'axios'
import JsonFormat from './json-format-display';

function ForgotPassword() {
    const [email, setEmail ] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const response = await axios.post(`http://localhost:5000/users/forgot-password`, { email })
            if (response.status === 200){
                setError(null)
                setMessage('Mail sent successfully!')
            }
        } catch(e) {
            setMessage(null)
            if (e.response){
                setError(e.response.data);
            } else {
                setError('An error occurred');
            }
        }
    }

    const fields = [
        { label: 'Email', name: 'email', type: 'email' }
    ];

    return (
        <div className='login-error'>
            <div className='container'>
                <h1>Reset Password</h1>
                <div className='sign-form'>
                    <FormComponent 
                        fields={ fields }
                        formData={ { email} }
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton='Send Mail'
                    />
                </div>
            </div>
            { message && <p className='center'>{ message }</p>}
            { error && <JsonFormat jData = { error }  errorClass='eText center' />}
        </div>
    )
}

export default ForgotPassword