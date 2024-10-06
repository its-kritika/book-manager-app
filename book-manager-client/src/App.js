import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './routers/login';
import Dashboard from './routers/dashboard'
import JsonData from './routers/json-data';
import UpdateBook from './routers/update-book';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboard/json-data" element={<JsonData />} /> 
        <Route path="/dashboard/update-your-book" element={<UpdateBook />} />
      </Routes>
      
    </div>
  );
}

export default App;
