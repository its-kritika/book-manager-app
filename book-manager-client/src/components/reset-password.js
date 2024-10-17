import { useState, useEffect } from 'react';
import FormComponent from './form';
import axios from 'axios';
import Error from './error';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ResetPassword({ type }) {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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
        setLoading(true)

        try {
            if (type === 'forgot') {
                const response = await axios.post('/users/forgot-password', { email });
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
                const response = await axios.patch('/user/me', { password }, config);
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
        } finally {
            setLoading(false)
        }
    };

    const toggleForm = () => {
        navigate('/')
    }

    const fields = type === 'forgot'
        ? [{ label: 'Email', name: 'email', type: 'email' }]
        : [{ label: 'Password', name: 'password', type: 'password' }];

    return (
        <div className='login-error'>
            <div className='container'>
                <h1 className='heading'>{type === 'forgot' ? 'Enter your ID' : 'Reset Password'}</h1>
                <div className='sign-form'>
                    { type === 'reset' ? '' : (
                        <div className='back-button'>   
                            <span onClick={toggleForm}><FontAwesomeIcon icon={faArrowLeft} /></span>
                        </div>
                    )}
                    <FormComponent
                        fields={fields}
                        formData={type === 'forgot' ? { email } : { password }}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        submitButton={type === 'forgot' ? 'Send Mail' : 'Set Password'}
                    />
                </div>
            </div>
            {
                loading ? (<Error e={'Loading... Please wait!'} message={'mail-msg'} />) : 
                       (error && <Error e={error} /> )
            }
            {message && <Error e = { message } message = {'mail-msg'}/>}
        </div>
    );
}

export default ResetPassword;
