import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isUserLoggedIn } from './redux/loginSlice';
import './App.css';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';

function App() {
  const loggedInUser = useSelector(isUserLoggedIn);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={loggedInUser ? <Navigate replace to="/home" /> : <Login formForLogin />} />
          <Route path="/*" element={loggedInUser ? <Dashboard /> : <Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
