import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BasicTabs from '../overalllayout/OverallLayout';
import Register from "../login/Register";
import Login from "../login/Login";
import ProtectedRoute from '../login/ProtectedRoute';

function MainPage() {
    return (
        <div className="main-page">
            <BasicTabs/>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<ProtectedRoute><MainPage/></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
}

export default App;
