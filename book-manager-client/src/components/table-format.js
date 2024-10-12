import { useLocation } from 'react-router-dom';
import TableComponent from './table-component';

function TableFormat() {
    const location = useLocation();
    const {data, heading} = location.state || {};

    return <TableComponent data={data} heading={heading} />;
}

export default TableFormat;
