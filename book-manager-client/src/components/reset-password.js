import { useState, useEffect } from 'react';
import FormComponent from './form';
import axios from 'axios';
import JsonFormat from './json-format-display';
import { useLocation } from 'react-router-dom';

function ResetPassword({ type }) {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // detect url change for reset password token
    useEffect(() => {
        if (type === 'reset') {
            const token = new URLSearchParams(location.search).get('token');
            setToken(token);
        }
    }, [location, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (type === 'forgot') {
                const response = await axios.post('http://localhost:5000/users/forgot-password', { email });
                if (response.status === 200) {
                    setError(null);
                    setMessage('Mail sent successfully!');
                }
            } else if (type === 'reset') {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const response = await axios.patch('http://localhost:5000/user/me', { password }, config);
                if (response.status === 200) {
                    setError(null);
                    setMessage('Password changed successfully!! You can close this window now!');
                }
            }
        } catch (e) {
            setMessage(null);
            if (e.response) {
                setError(e.response.data);
            } else {
                setError('An error occurred');
            }
        }
    };

    const fields = type === 'forgot'
        ? [{ label: 'Email', name: 'email', type: 'email' }]
        : [{ label: 'Password', name: 'password', type: 'password' }];

    return (
        <div className='login-error'>
            <div className='container'>
                <h1 className='heading'>{type === 'forgot' ? 'Enter your ID' : 'Reset Password'}</h1>
                <div className='sign-form'>
                    <FormComponent
                        fields={fields}
                        formData={type === 'forgot' ? { email } : { password }}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        submitButton={type === 'forgot' ? 'Send Mail' : 'Set Password'}
                    />
                </div>
            </div>
            {message && <p className='center'>{message}</p>}
            {error && <JsonFormat jData={error} errorClass={`eText ${type === 'forgot' ? 'center' : ''}`} />}
        </div>
    );
}

export default ResetPassword;
