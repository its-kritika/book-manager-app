import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

function UpdateUser(){

    const location = useLocation();
    const { data : userData } = location.state || {};
    const [error, setError] = useState(null)
    const [jsonData, setJsonData] = useState()
    
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        // setting input fields with initial values
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || ''
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const token = localStorage.getItem('authToken');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const response = await axios.patch(`http://localhost:5000/user/me`, formData, config)

            if (response.status === 200){
                setError(null)
                setJsonData(response.data)
            }
        } catch(e) {
            if (e.response){
                setError(e.response.data);
            } else {
                setError('An error occurred');
            }
        }
    }


    return(
        <div className='container'>
            <h1>Alter fields to update</h1>
            <div className='sign-form'>
                <form onSubmit={ handleSubmit }>
                    <div className='box'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            name="name"
                            onChange={handleChange}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            className = 'input-form'
                            required />
                    </div>
                    
                    <div className='sign-container'>
                        <button type="submit" className='sign-button'>Update User</button>
                    </div>
                </form>
            </div>
            <div className='container text'>
                <pre>{JSON.stringify(jsonData, null, 2)}</pre> 
            </div>
            {error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}
        </div>
    )
}

export default UpdateUser;