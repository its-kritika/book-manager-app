import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

function UpdateBook(){

    const location = useLocation();
    const { data : bookData } = location.state || {};
    const [error, setError] = useState(null)
    const [jsonData, setJsonData] = useState(null)
    
    const [formData, setFormData] = useState({
        title: '',
        author_name: '',
        genre: '',
    });

    useEffect(() => {
        // setting input fields with initial values
        if (bookData) {
            setFormData({
                title: bookData.title || '',
                author_name: bookData.author_name || '',
                genre: bookData.genre || '',
            });
        }
    }, [bookData]);

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
            const response = await axios.patch(`http://localhost:5000/book/${bookData._id}`, formData, config)

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
                        <label>Title:</label>
                        <input
                            type="text"
                            value={formData.title}
                            name="title"
                            onChange={handleChange}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Author:</label>
                        <input
                            type="text"
                            value={formData.author_name}
                            name="author_name"
                            onChange={handleChange}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Genre:</label>
                        <input
                            type="text"
                            value={formData.genre}
                            name="genre"
                            onChange={handleChange}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='sign-container'>
                        <button type="submit" className='sign-button'>Update Book</button>
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

export default UpdateBook;
