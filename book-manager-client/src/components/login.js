import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormComponent from './form';
import JsonFormat from './json-format-display';

function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(true); // toggle between signup and signIn
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState(null);
 
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData

        const userData = isSignUp ? formData : { email, password };

        try {
            const response = await axios.post(`http://localhost:5000/users${isSignUp ? '' : '/login'}`, userData);

            if (response.status === 201 || response.status === 200) {
                // when user is logged in successfully, token should be saved for future authentication use
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
        // reset all fields
        setIsSignUp(!isSignUp)
        setFormData({
            name: '',
            email: '',
            password: ''
        })
        setError(null)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleForgotPass = () => {
        navigate('/forgot-password')
    }

    // if isSignUp true, name field will be displayed else no
    const fields = [
        ...(isSignUp ? [{ label: 'Name', name: 'name', type: 'text' }] : []),
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Password', name: 'password', type: 'password' }
    ]

    return (
        <div className='login-error'>
            <div className='container'>
                <h1>{ isSignUp ? 'Signup Form' : 'SignIn Form'}</h1>
                
                <div className='sign-form'>
                { isSignUp ? '' : (
                    <div className='back-button'>   
                        <span onClick={toggleForm}>back</span>
                    </div>
                )}
                    <FormComponent 
                        fields ={ fields }
                        formData={ formData }
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton= {isSignUp ? 'Sign Up' : 'Sign In'}
                    />
                { isSignUp ? '' : (
                    <div className='password'>   
                        <span onClick={handleForgotPass}>Forgot Password?</span>
                    </div>
                )}
                </div>
                { isSignUp && 
                    <div className='extras'>
                        <p className = 'p-sign' onClick = {toggleForm}>Already have an account? Click Here to Sign In</p>  
                    </div>
                }
            </div>
            { error && <JsonFormat jData = { error }  errorClass={`eText ${isSignUp ? '' : 'center'}`} />}
        </div>
    );
}

export default AuthForm;

