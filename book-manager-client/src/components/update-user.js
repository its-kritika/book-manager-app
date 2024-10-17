import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import FormComponent from './form'
import Error from './error';
import TableComponent from './table-component';

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
            const response = await axios.patch('/user/me', formData, config)

            if (response.status === 200){
                setError(null)
                setJsonData(response.data)
            }
        } catch(e) {
            setJsonData()
            if (e.response){
                setError(e.response.data);
            } else {
                setError('An error occurred');
            }
        }
    }
    
    const fields = [
        { label: 'Name', name: 'name', type: 'text' },
        { label: 'Email', name: 'email', type: 'email', disabled: true },
    ];

    return(
        <div className='login-error'>
            <div className='container'>
                <h1 className='heading'>Alter fields to update</h1>
                <div className='sign-form'>
                    <FormComponent 
                        fields = {fields}
                        formData={formData}
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton='Update User'
                        />
                </div>
            </div>
            { jsonData && <TableComponent data = { jsonData } heading={'Your details have been updated!'}/>}
            { error && <Error e = { error } />}
        </div>
    )
}

export default UpdateUser;
