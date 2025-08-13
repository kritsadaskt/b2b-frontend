'use client';

import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { authService } from '../utils/auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const existingSession = authService.isAuthenticated();
    setIsAuthenticated(existingSession);
    setIsLoading(false);

    // Optional: Show remaining time in console for debugging
    if (existingSession) {
      // const remainingTime = authService.getRemainingTime();
      console.log(`Session restored.`);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this should be secure
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(undefined);
      
      // Store the session in localStorage
      authService.setSession(true);
      
      console.log('Login successful.');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError(undefined);
    
    // Clear the stored session
    authService.clearSession();
    
    console.log('Logged out successfully.');
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} error={loginError} />
      )}
    </div>
  );
}
