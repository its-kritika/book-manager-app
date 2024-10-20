function TableComponent({ data, heading }) {
    let headers;
    let dataArray;

    if (Array.isArray(data)) {
        if (data.length === 0){
            return (<div className='no-data errorPage'>No books found! Add some new books to view them here.</div>);
        }
        headers = Object.keys(data[0]); // for list of objects like Read all Books
        dataArray = data;
    } else if (typeof data === 'object' && data) {
        headers = Object.keys(data);
        dataArray = [data];
    }

    return (
        <div className='table-margin'>
            { heading && <h2 className='heading'>{heading}</h2>}
            <table className='table'>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataArray.map((item, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableComponent
