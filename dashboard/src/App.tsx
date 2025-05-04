import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import { isAuthenticated } from './services/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#10B981',
                  secondary: '#ECFDF5',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#EF4444',
                  secondary: '#FEF2F2',
                },
              },
            }}
          />
        </TransactionProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;