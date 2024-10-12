import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/login';
import Dashboard from './components/dashboard'
import UpdateBook from './components/update-book';
import UpdateUser from './components/update-user';
import CreateBook from './components/create-book';
import ResetPassword from './components/reset-password';
import PageNotFound from './components/page-not-found';
import TableFormat from './components/table-format';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboard/read-data" element={<TableFormat />} /> 
        <Route path="/dashboard/delete-data" element={<TableFormat />} /> 
        <Route path="/dashboard/update-your-book" element={<UpdateBook />} />
        <Route path="/dashboard/update-your-details" element={<UpdateUser />} />
        <Route path="/dashboard/create-book" element={<CreateBook />} />
        <Route path="/forgot-password" element={<ResetPassword type = 'forgot' />} />
        <Route path="/reset-password" element={<ResetPassword type = 'reset'/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;
