import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
  const location = useLocation();
  const {isAuthenticated} = useSelector(state => state.user);


  return (isAuthenticated === true)
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}


export default ProtectedRoutes
