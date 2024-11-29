import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import TonerForm from './components/TonerForm';
import CreateUser from './components/CreateUser';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <div className="main-content">
                                <Sidebar />
                                <Dashboard />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/toner"
                    element={
                        <ProtectedRoute>
                            <TonerForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <CreateUser />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;