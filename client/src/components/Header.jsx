// eas/client/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

export default function Header(){
  const auth = useSelector(s=>s.auth);
  const dispatch = useDispatch();
  return (
    <header>
      <Link to="/">Home</Link> | <Link to="/mark">Mark</Link> | <Link to="/history">History</Link>
      {auth.user?.role === 'manager' && <> | <Link to="/manager">Manager</Link> | <Link to="/reports">Reports</Link></>}
      {auth.user ? <button onClick={()=>dispatch(logout())}>Logout</button> : <Link to="/login">Login</Link>}
    </header>
  );
}
