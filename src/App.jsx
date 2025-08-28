import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import ConferenceList from './components/Conference/ConferenceList';
import ConferenceDetail from './components/Conference/ConferenceDetail';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChangePassword from './components/Auth/ChangePassword';
import AdminDashboard from './components/Admin/AdminDashboard';
import ConferenceAdmin from './components/Admin/ConferenceAdmin';
import UserAdmin from './components/Admin/UserAdmin';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="container-fluid">
            <Routes>
              {/* Routes publiques - connexion/inscription */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Routes protégées - nécessitent une authentification */}
              <Route path="/" element={
                <ProtectedRoute>
                  <ConferenceList />
                </ProtectedRoute>
              } />
              <Route path="/conferences/:id" element={
                <ProtectedRoute>
                  <ConferenceDetail />
                </ProtectedRoute>
              } />
              <Route path="/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />
              
              {/* Routes d'administration - protégées + admin requis */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/conferences" element={
                <ProtectedRoute requireAdmin>
                  <ConferenceAdmin />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <UserAdmin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;