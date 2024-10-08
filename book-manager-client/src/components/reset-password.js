import { useState } from 'react';
import FormComponent from './form'
import axios from 'axios'
import JsonFormat from './json-format-display';

function ResetPassword() {
    const [password, setPassword ] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        setPassword(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = new URLSearchParams(window.location.search).get('token');
        
        const config = {
            headers : {
                "Authorization" : `Bearer ${token}`
            }   
        }
        
        try{
            const response = await axios.patch(`http://localhost:5000/user/me`, { password }, config)
            if (response.status === 200){
                setError(null)
                setMessage('Password changed successfully!')
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
        { label: 'Password', name: 'password', type: 'password' }
    ];

    return (
        <div className='login-error'>
            <div className='container'>
                <h1>Reset Password</h1>
                <div className='sign-form'>
                    <FormComponent 
                        fields={ fields }
                        formData={ { password} }
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton='Set Password'
                    />
                </div>
            </div>
            { message && <p className='center'>{ message }</p>}
            { error && <JsonFormat jData = { error }  errorClass='eText center' />}
        </div>
    )
}

export default ResetPassword