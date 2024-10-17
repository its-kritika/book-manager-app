import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './error'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
    const operations = [
        { name: 'Create Book', heading: 'Enter Details of the Book'},
        { name: 'Update Book' },
        { name: 'Delete Book' },
        { name: 'Read All Books', url: '/books', heading: 'List of all your Books'},
        { name: 'Read Single Book' },
        { name: 'Read Profile', url: '/users/me', heading: 'About You'},
        { name: 'Update User', url: '/users/me' },
        { name: 'Delete User', url: '/user/me'},
        { name: 'Logout All Users', url: '/users/logoutAll'}
    ]
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const googleToken = new URLSearchParams(window.location.search).get('token');
        if (googleToken){
            localStorage.setItem('authToken', googleToken);

            // remove token from url to prevent manipulation of token by the user
            const url = new URL(window.location);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url);
        }
    }, []);

    const token = localStorage.getItem('authToken');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const handleClick = async (operation) => {
        setError()
        setLoading(true)
        // Reusable function to handle prompts for Book ID
        const getBookId = () => prompt("Enter the Book ID:");
    
        try {
            let response;
            let url = `${operation.url}`;
    
            if (operation.name === 'Read All Books' || operation.name === 'Read Profile' || operation.name === 'Update User') {
        
                response = await axios.get(url, config);

                if (response.status === 200) {
                    setError(null); // Clear error on success
                    if (operation.name === 'Update User'){
                        navigate(`/dashboard/update-your-details`, { state: { data: response.data } });
                    } else{
                        navigate(`/dashboard/read-data`, { state: { data: response.data, heading: operation.heading } });
                    }
                }

            } else if (operation.name === 'Delete User' || operation.name === 'Logout All Users') {
                // Show a confirmation dialog to the user
                const confirmationMessage = operation.name === 'Delete User' 
                  ? 'Are you sure you want to permanently delete your account? This action cannot be undone.'
                  : 'This action will remove your account from all devices and redirect you to the login page.'

                const isConfirmed = window.confirm(confirmationMessage);

                if (isConfirmed){
                    const response = operation.name === 'Delete User' 
                            ? await axios.delete(url, config)
                            : await axios.post(url, {}, config);

                    if (response.status === 200) {
                        navigate('/');
                    }
                }

            } else if (operation.name === 'Create Book'){
                navigate('/dashboard/create-book', {state : { heading : operation.heading }});

            } else {
                const bookId = getBookId(); // Get Book ID from user
                const bookUrl = `/book/${bookId}`
                if (bookId) {
                        
                    if (operation.name === 'Delete Book') {
                        
                        response = await axios.delete(bookUrl, config);
                        if (response.status === 200) {
                            setError(null); // Clear error on success
                            navigate(`/dashboard/delete-data`, { state: { data: response.data, heading: `Your Book with ID: ${bookId} was successfully deleted!` } });
                        }
                    } else {
                
                        response = await axios.get(bookUrl, config);
                        if (response.status === 200) {
                            setError(null); // Clear error on success
                            if (operation.name === 'Read Single Book') {
                                navigate(`/dashboard/read-data`, { state: { data: response.data, heading: `Details of Book ID: ${bookId}` } });
                            } else{
                                navigate(`/dashboard/update-your-book`, { state: { data: response.data } });
                            }
                        }
                    }
                } else {
                    setError('No Book ID provided');
                }
    
            }
        } catch (e) {
            // Handle errors and display on the screen
            if (e.response) {
                setError(e.response.data.error || 'No data found!'); // Set error message from server response
            } else {
                setError('An error occurred'); // Fallback message if there's no server response
            }
        } finally {
            setLoading(false)
        }
    };    

    const logOut = async () => {
        setLoading(true)
        
        try{
            const response = await axios.post('/users/logout', {}, config)
            if (response.status === 200) {
                navigate('/');
            }
        } catch(e){
            setError('An error occurred')
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div>
            <div className='back-button logout'>
                <div onClick={ logOut } className='font-flex'><FontAwesomeIcon icon={faRightFromBracket} />Logout</div>
            </div>
            {
                loading ? (<Error e={'Loading... Please wait!'} message={'mail-msg'} />) : 
                       (<Error e={error} /> )
            }

            <div className='grid'>
                {operations.map((operation, index) => (
                    <div key={index} className='grid-item' onClick={() => handleClick(operation)}>
                        {operation.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;