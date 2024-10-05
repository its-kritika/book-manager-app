import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './routers/user';
import Dashboard from './routers/dashboards'
import JsonData from './routers/json-data';
import AllForms from './routers/form';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboard/json-data" element={<JsonData />} /> 
        <Route path="/dashboard/forms" element={<AllForms />} />
      </Routes>
      
    </div>
  );
}

export default App;
