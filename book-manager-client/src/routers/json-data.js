import { useLocation } from 'react-router-dom';

function JsonData() {
    const location = useLocation();
    const {data, heading} = location.state || {}; // Access the data passed from the previous page

    return (
        <div>
            {data ? (
                <div className='container text'>
                    <h2>{ heading }</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre> 
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default JsonData;

