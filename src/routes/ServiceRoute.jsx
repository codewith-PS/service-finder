import React, {Children} from 'react'
import { Navigate } from 'react-router-dom'

export default function ServiceRoute({children}) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if(!token) return <Navigate to="/login"/>
    if(role !== 'user') return <Navigate to="/"/>
  return children;
}
