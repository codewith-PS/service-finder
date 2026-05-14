import React, {children} from 'react';
import { Navigate } from "react-router-dom";

export default function ProviderRoute({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return <Navigate to='/login' />
    if (role !== 'provider') return <Navigate to='/' />

    return children;
}
