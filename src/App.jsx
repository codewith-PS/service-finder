import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';
import Register from './Register';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import ProviderRoute from './routes/ProviderRoute';
import Service from './Service';
import ServiceRoute from './routes/ServiceRoute';
import ProviderDashboard from './ProviderDashboard';
import ServiceTest from './servicetest';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/servicetest' element={<ServiceTest/>}/>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/providerdashboard' element={
            <ProviderRoute>
              <ProviderDashboard />
            </ProviderRoute>
          } />
          <Route path='/service' element={
            <ServiceRoute>
              <Service />
            </ServiceRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
