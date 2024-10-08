import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/login';
import Dashboard from './components/dashboard'
import JsonData from './components/json-data';
import UpdateBook from './components/update-book';
import UpdateUser from './components/update-user';
import CreateBook from './components/create-book';
import ForgotPassword from './components/forgot-password'
import ResetPassword from './components/reset-password';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboard/json-data" element={<JsonData />} /> 
        <Route path="/dashboard/update-your-book" element={<UpdateBook />} />
        <Route path="/dashboard/update-your-details" element={<UpdateUser />} />
        <Route path="/dashboard/create-book" element={<CreateBook />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      
    </div>
  );
}

export default App;
