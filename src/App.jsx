import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MixingsList from './pages/mixings/MixingsList';
import MixingDetail from './pages/mixings/MixingDetail';
import CreateMixing from './pages/mixings/CreateMixing';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/mixings" 
            element={
              <ProtectedRoute>
                <MixingsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mixings/:id" 
            element={
              <ProtectedRoute>
                <MixingDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-mixing" 
            element={
              <ProtectedRoute>
                <CreateMixing />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;