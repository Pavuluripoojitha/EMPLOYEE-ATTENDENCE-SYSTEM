// eas/client/src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, managerOnly=false }){
  const auth = useSelector(s => s.auth);
  if (!auth.user) return <Navigate to="/login" replace />;
  if (managerOnly && auth.user.role !== 'manager') return <Navigate to="/" replace />;
  return children;
}
