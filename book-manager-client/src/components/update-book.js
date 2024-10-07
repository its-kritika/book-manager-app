import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import FormComponent from './form'
import JsonFormat from './json-format-display';

function UpdateBook(){

    const location = useLocation();
    const { data : bookData } = location.state || {};
    const [error, setError] = useState(null)
    const [jsonData, setJsonData] = useState()
    
    const [formData, setFormData] = useState({
        title: '',
        author_name: '',
        genre: ''
    });

    useEffect(() => {
        // setting input fields with initial values
        if (bookData) {
            setFormData({
                title: bookData.title || '',
                author_name: bookData.author_name || '',
                genre: bookData.genre || ''
            });
        }
    }, [bookData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const token = localStorage.getItem('authToken');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const response = await axios.patch(`http://localhost:5000/book/${bookData._id}`, formData, config)

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
        { label: 'Title', name: 'title', type: 'text' },
        { label: 'Author', name: 'author_name', type: 'text' },
        { label: 'Genre', name: 'genre', type: 'text' }
    ];


    return(
        <div className='login-error'>
            <div className='container'>
                <h1>Alter fields to update</h1>
                <div className='sign-form'>
                    <FormComponent 
                        fields = {fields}
                        formData={formData}
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton='Update Book'
                        />
                </div>
            </div>
            { jsonData && <JsonFormat jData = { jsonData } />}
            { error && <JsonFormat jData = { error }  errorClass='eText' />}
        </div>
    )
}

export default UpdateBook;
