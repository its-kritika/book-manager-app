import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(true); // toggle between signup and signIn
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = isSignUp ? { name, email, password } : { email, password };

        try {
            const response = await axios.post(`http://localhost:5000/users${isSignUp ? '' : '/login'}`, userData);

            if (response.status === 201 || response.status === 200) {
                // Successfully created user
                // setMessage(`${isSignUp ? 'User is successfully created!' : 'You are successfully logged in!'}`);
                // When user logs in successfully
                localStorage.setItem('authToken', response.data.token);

                setError(null);
                navigate('/dashboard')
            }
        } catch (e) {
            // Handle error response from backend
            if (e.response) {
                setError(e.response.data);
            } else {
                setError('An error occurred');
            }
        }
    };

    const toggleForm = () => {
        setIsSignUp(!isSignUp)
    }

    return (
        <div className='container'>
            <h1>{ isSignUp ? 'Signup Form' : 'SignIn Form'}</h1>
            
            <div className='sign-form'>
            { isSignUp ? '' : (
                <div className='back-button'>   
                    <span onClick={toggleForm}>back</span>
                </div>
            )}
                <form onSubmit={handleSubmit}>
                { isSignUp && (
                    <div className='box'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                )}
                    <div className='box'>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='sign-container'>
                        <button type="submit" className='sign-button'>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                    </div>
                </form>
            </div>
            <div className='extras'>
                { isSignUp && <p className = 'p-sign' onClick = {toggleForm}>Already have an account? Click Here to Sign In</p>}
                {error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}
                {/* {message && <p style={{ color: 'green' }}>{message}</p>} */}
            </div>
        </div>
    );
}

export default AuthForm;

