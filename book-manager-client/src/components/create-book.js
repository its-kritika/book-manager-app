import { useState } from 'react'
import axios from 'axios'
import FormComponent from './form'
import Error from './error'
import TableComponent from './table-component'

function CreateBook(){
    const [formData, setFormData] = useState({
        title : '',
        author : '',
        genre : ''
    })
    const [error, setError] = useState(null)
    const [jsonData, setJsonData] = useState()
    

    const token = localStorage.getItem('authToken');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const response = await axios.post(`http://localhost:5000/books`, formData, config)
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

    const fields = [
        { label: 'Title', name: 'title', type: 'text' },
        { label: 'Author', name: 'author_name', type: 'text' },
        { label: 'Genre', name: 'genre', type: 'text' }
    ]


    return(
        <div className='login-error'>
            <div className='container'>
                <h1 className='heading'>Enter details of the book</h1>
                <div className='sign-form'>
                    <FormComponent 
                        fields = { fields }
                        formData={formData}
                        handleChange={ handleChange }
                        handleSubmit={ handleSubmit }
                        submitButton='Create Book'
                    />
                </div>
            </div>
            { jsonData && <TableComponent data = { jsonData } heading = { 'Book has been added!' }/>}
            { error && <Error e = { error } />}
        </div>
    )
}

export default CreateBook;