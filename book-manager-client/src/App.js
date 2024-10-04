import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './routers/user';
import Dashboard from './routers/dashboard'
import CreateBook from './routers/create-book';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboard/create-book" element={<CreateBook />} /> 
      </Routes>
      
    </div>
  );
}

export default App;
