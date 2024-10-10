import { useLocation } from 'react-router-dom';
import JsonFormat from './json-format-display';

function JsonData() {
    const location = useLocation();
    const {data, heading} = location.state || {}; // Access the data passed from the previous page

    return (
        <div>
            {data ? (
                <div className='login-error'>
                    <h2 className='heading'>{ heading }</h2>
                    <JsonFormat jData = { data } />
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default JsonData;

