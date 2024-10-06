import { useState } from 'react'
import axios from 'axios'

function CreateBook(){
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [genre, setGenre] = useState('')
    const [error, setError] = useState(null)
    const [jsonData, setJsonData] = useState()
    

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
            const bookData = {title, author_name: author, genre}
            const response = await axios.post(`http://localhost:5000/books`, bookData, config)
            if (response.status === 201){
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
            <h1>Enter details of the book</h1>
            <div className='sign-form'>
                <form onSubmit={ handleSubmit }>
                    <div className='box'>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            name='title'
                            onChange={(e) => setTitle(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Author:</label>
                        <input
                            type="text"
                            value={author}
                            name='author'
                            onChange={(e) => setAuthor(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                    <div className='box'>
                        <label>Genre:</label>
                        <input
                            type="text"
                            value={genre}
                            name='genre'
                            onChange={(e) => setGenre(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                    
                    <div className='sign-container'>
                        <button type="submit" className='sign-button'>Create Book</button>
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

export default CreateBook;