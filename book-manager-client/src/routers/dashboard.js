import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const operations = [
        { name: 'Create Book', method: 'post', url: '/books' },
        { name: 'Update Book', method: 'patch', url: '/book/:id' },
        { name: 'Delete Book', method: 'delete', url: '/book/:id' },
        { name: 'Read All Books', method: 'get', url: '/books' },
        { name: 'Read Single Book', method: 'get', url: '/books/:id' },
        { name: 'Read Profile', method: 'get', url: '/users/me' },
        { name: 'Update User', method: 'patch', url: '/user/me' },
        { name: 'Delete User', method: 'delete', url: '/user/me' },
        { name: 'Logout All Users', method: 'post', url: '/users/logoutAll' },
    ];

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleClick = async (operation) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            let response;
            if (operation.method == 'get') {
                response = await axios.get(`http://localhost:5000${operation.url}`, config);
            }
            else{
                navigate('/dashboard/')
            }

            if (response.status === 200 || response.status === 201) {
                setError(null);
                navigate(`/dashboard/create-book`); // Navigate to the corresponding page after successful request
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


