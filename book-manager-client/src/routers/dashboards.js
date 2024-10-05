import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const operations = [
        { name: 'Create Book' },
        { name: 'Update Book' },
        { name: 'Delete Book' },
        { name: 'Read All Books', url: '/books', heading: 'List of all your Books'},
        { name: 'Read Single Book' },
        { name: 'Read Profile', url: '/users/me', heading: 'About You'},
        { name: 'Update User' },
        { name: 'Delete User' },
        { name: 'Logout All Users' }
    ]
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleClick = async (operation) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
    
        // Reusable function to handle prompts for Book ID
        const getBookId = () => prompt("Enter the Book ID:");
    
        try {
            let response;
            let url = `http://localhost:5000${operation.url}`;
    
            if (operation.name === 'Read All Books' || operation.name === 'Read Profile') {
        
                response = await axios.get(url, config);
                if (response.status === 200) {
                    setError(null); // Clear error on success
                    navigate(`/dashboard/json-data`, { state: { data: response.data, heading: operation.heading } });
                }

            } else if (operation.name === 'Read Single Book' || operation.name === 'Delete Book') {
                
                const bookId = getBookId(); // Get Book ID from user
                if (bookId) {
                    
                    if (operation.name === 'Delete Book') {
                    
                        response = await axios.delete(`http://localhost:5000/book/${bookId}`, config);
                        if (response.status === 200) {
                            setError(null); // Clear error on success
                            navigate(`/dashboard/json-data`, { state: { data: response.data, heading: `Your Book with ID: ${bookId} was successfully deleted!` } });
                        }
                    } else {
                        // Read Single Book
                        response = await axios.get(`http://localhost:5000/books/${bookId}`, config);
                        if (response.status === 200) {
                            setError(null); // Clear error on success
                            navigate(`/dashboard/json-data`, { state: { data: response.data, heading: `Details of Book ID: ${bookId}` } });
                        }
                    }
                } else {
                    setError('No Book ID provided');
                }

            } else {
                // Handle other operations
                navigate('/dashboard/forms');
            }
        } catch (e) {
            // Handle errors and display on the screen
            if (e.response) {
                setError(e.response.data.message || 'No data found!'); // Set error message from server response
            } else {
                setError('An error occurred'); // Fallback message if there's no server response
            }
        }
    };    
    
    return (
        <div>
            <div className='back-button'>
                <span>Logout</span>
            </div>
            <div className='operation-box'>
                <div className='grid'>
                    {operations.map((operation, index) => (
                        <div key={index} className='grid-item' onClick={() => handleClick(operation)}>
                            <img src='/images/books.jpg' alt='book' />
                            {operation.name}
                        </div>
                    ))}
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}
        </div>
    );
}

export default Dashboard;