import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api/axios';

const AdminDashboard = () => {
  useEffect(() => {

    api.get('/service')
      .then((res) => {
        setServices(res.data.service);
        console.log(res.data.service);
      })
      .catch((err) => {
        console.log(err.response?.data || "Error");
      });
  }, []);
  const navigate = useNavigate();
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceName, setServiceName] = useState('');

  // Mock Data
  const [services, setServices] = useState([]);

  // const [providers] = useState([
  //   { id: 1, name: 'Rajesh Plumbing', service: 'Plumbing', location: 'Downtown', experience: '8 years', rating: 4.8, jobs: 234 },
  //   { id: 2, name: 'Bright Electric', service: 'Electrician', location: 'Westside', experience: '5 years', rating: 4.9, jobs: 189 },
  //   { id: 3, name: 'Woodcraft Pros', service: 'Carpentry', location: 'North area', experience: '12 years', rating: 5.0, jobs: 456 },
  //   { id: 4, name: 'Sharma Painting', service: 'Painting', location: 'Eastside', experience: '6 years', rating: 4.7, jobs: 167 },
  //   { id: 5, name: 'CleanMaster', service: 'Cleaning', location: 'Southside', experience: '4 years', rating: 4.6, jobs: 98 },
  // ]);

  const [bookings, setBookings] = useState([
    { id: 101, user_name: 'Amit Sharma', user_avatar: 'AS', provider_name: 'Rajesh Plumbing', date: '2025-05-10', time: '10:00 AM', status: 'pending', amount: '₹499' },
    { id: 102, user_name: 'Neha Verma', user_avatar: 'NV', provider_name: 'Bright Electric', date: '2025-05-12', time: '2:00 PM', status: 'completed', amount: '₹899' },
    { id: 103, user_name: 'Rohan Singh', user_avatar: 'RS', provider_name: 'Woodcraft Pros', date: '2025-05-15', time: '11:30 AM', status: 'pending', amount: '₹1299' },
    { id: 104, user_name: 'Priya Patel', user_avatar: 'PP', provider_name: 'Sharma Painting', date: '2025-05-18', time: '9:00 AM', status: 'pending', amount: '₹2499' },
    { id: 105, user_name: 'Vikram Kumar', user_avatar: 'VK', provider_name: 'CleanMaster', date: '2025-05-20', time: '3:00 PM', status: 'completed', amount: '₹599' },
  ]);

  const [stats, setStats] = useState({
    totalServices: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Update Stats
  // useEffect(() => {
  //   const completedAmount = bookings
  //     .filter(b => b.status === 'completed')
  //     .reduce((sum, b) => sum + parseInt(b.amount.replace('₹', '')), 0);

  //   setStats({
  //     totalServices: services.length,
  //     totalProviders: providers.length,
  //     totalBookings: bookings.length,
  //     pendingBookings: bookings.filter(b => b.status === 'pending').length,
  //     completedBookings: bookings.filter(b => b.status === 'completed').length,
  //     totalRevenue: completedAmount,
  //   });
  // }, [services, providers, bookings]);

  // Handle Click Outside for Dropdown
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (profileRef.current && !profileRef.current.contains(event.target) &&
  //       dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setDropdownOpen(false);
  //     }
  //   };
  //   document.addEventListener('click', handleClickOutside);
  //   return () => document.removeEventListener('click', handleClickOutside);
  // }, []);

  // Service CRUD Operations
  const handleAddService = () => {
    setEditingService(null);
    setServiceName('');
    setIsModalOpen(true);
  };

  const handleEditService = async (id) => {
    setIsModalOpen(true);
    // setEditingService(service);
    // setServiceName(service.name);
    try {
      const res = await api.put(`/service/${id}`, {
        'name': serviceName
      })
      console.log(res.data);
    } catch (err) {
      console.log(err.response?.data || "Error");
    }
  };

  const handleDeleteService = async (id, svcname) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${svcname} service?`
    );
    if (!confirmDelete) return;
    try {
      const res = await api.delete(`/service/${id}`)
      console.log(res.data.message);
      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (err) {
      console.log(err.response?.data || "Error");
    }
  };

  const handleSaveService = async () => {
    if (!serviceName.trim()) {
      toast.error("Service name required");
      return;
    }

    try {
      const res = await api.post("/service", {
        name: serviceName,
      });

      // new service ko state me add karo
      setServices((prev) => [...prev, res.data.service]);

      setIsModalOpen(false);
      toast.success("Service added successfully!!");

      setServiceName("");
      setEditingService(null);

    } catch (err) {
      console.log(err.response?.data || "Error");
    }
  };

  // console.log(localStorage.getItem('token'));
  // const handleSaveService = async () => {
  //   if (!serviceName.trim()) {
  //     toast.error('Service name required');
  //     return;
  //   }

  //   try {
  //     const res = await api.post('/service', {
  //       name: serviceName
  //     });
  //     console.log(res.data);
  //     toast.success('service add successfully!!');

  //   } catch (err) {
  //     console.log(err.response?.data || "Error");
  //   }
  //   setIsModalOpen(false);
  //   setServiceName('');
  //   setEditingService(null);
  // };

  // if (editingService) {
  //   setServices(services.map(s =>
  //     s.id === editingService.id ? { ...s, name: serviceName } : s
  //   ));
  // } else {
  //   const newId = Math.max(...services.map(s => s.id), 0) + 1;
  //   setServices([...services, { id: newId, name: serviceName, icon: 'fa-star', color: '#6b7280' }]);
  // }

  // Booking Status Update
  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      const res = await api.post('http://127.0.0.1:8000/api/adminlogout')
        .then((res) => {
          // console.log(res.data);
          toast.warning(res.data.message);
          localStorage.removeItem('token')
          setTimeout(() => {
            navigate('/login');
          }, 1000);
          setDropdownOpen(false);
        })
        .catch((err) => {
          // console.error('err', err);
        })
    } catch(error){
      // console.log('err', error);
    }

  };


  // const res = await axios.get('http://127.0.0.1:8000/api/admin/dashboard')
  // .then((res)=>{
  //     console.log(res.data);
  // })
  // .catch((err)=>{
  //     console.log('err', err);
  // })
  // alert('Logged out successfully!');

  // Get status color
  const getStatusColor = (status) => {
    return status === 'pending'
      ? { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' }
      : { bg: '#d1fae5', color: '#059669', dot: '#10b981' };
  };

  // Dashboard Component
  const Dashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Services</p>
            <h3>{services.length}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#e0f2fe' }}>
            <i className="fas fa-cogs" style={{ color: '#0ea5e9' }}></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p>Service Providers</p>
            <h3>{stats.totalProviders}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7' }}>
            <i className="fas fa-users" style={{ color: '#10b981' }}></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Bookings</p>
            <h3>{stats.totalBookings}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
            <i className="fas fa-calendar-check" style={{ color: '#f59e0b' }}></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p>Pending Bookings</p>
            <h3>{stats.pendingBookings}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#ffe4e6' }}>
            <i className="fas fa-clock" style={{ color: '#ec489a' }}></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p>Completed Bookings</p>
            <h3>{stats.completedBookings}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#d1fae5' }}>
            <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Revenue</p>
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#fae8ff' }}>
            <i className="fas fa-rupee-sign" style={{ color: '#a855f7' }}></i>
          </div>
        </div>
      </div>

      {/* Recent Activity and Chart */}
      <div className="dashboard-grid">
        <div className="card-panel">
          <div className="card-header">
            <h3><i className="fas fa-chart-line"></i> Weekly Booking Activity</h3>
            <span className="badge">Last 7 days</span>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const heights = [28, 42, 35, 48, 52, 38, 45];
                return (
                  <div key={day} className="chart-bar-item">
                    <div className="chart-bar" style={{ height: `${heights[idx]}px` }}>
                      <span className="chart-value">{heights[idx]}</span>
                    </div>
                    <span>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card-panel">
          <div className="card-header">
            <h3><i className="fas fa-bell"></i> Recent Bookings</h3>
            <span className="badge">Latest 4</span>
          </div>
          <div className="recent-bookings">
            {bookings.slice(0, 4).map(booking => {
              const statusColor = getStatusColor(booking.status);
              return (
                <div key={booking.id} className="recent-booking-item">
                  <div className="recent-booking-avatar" style={{ background: '#e2e8f0', color: '#64748b' }}>
                    {booking.user_avatar}
                  </div>
                  <div className="recent-booking-info">
                    <div className="recent-booking-name">{booking.user_name}</div>
                    <div className="recent-booking-detail">{booking.provider_name} • {booking.date}</div>
                  </div>
                  <div className="recent-booking-status">
                    <span className="status-dot" style={{ background: statusColor.dot }}></span>
                    <span style={{ color: statusColor.color }}>{booking.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  // Services Management Component
  const ServicesManagement = () => (
    <div className="section-container">
      <div className="card-panel">
        <div className="card-header">
          <h3><i className="fas fa-list-ul"></i> All Services</h3>
          <button className="btn-primary" onClick={handleAddService}>
            <i className="fas fa-plus"></i> Add New Service
          </button>
        </div>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon" style={{ background: `${service.color}15` }}>
                <i className={`fas ${service.icon || 'fa-wrench'}`} style={{ color: service.color }}></i>
              </div>
              <div className="service-info">
                <h4>{service.svcname}</h4>
                <span className="service-id">ID: {service.id}</span>
              </div>
              <div className="service-actions">
                <button className="icon-btn edit" onClick={() => handleEditService(service.id)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="icon-btn delete" onClick={() => handleDeleteService(service.id, service.svcname)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Providers List Component
  const ProvidersList = () => (
    <div className="section-container">
      <div className="card-panel">
        <div className="card-header">
          <h3><i className="fas fa-briefcase"></i> Registered Providers</h3>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search providers..." />
          </div>
        </div>
        <div className="providers-grid">
          {providers.map(provider => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <div className="provider-avatar">
                  {provider.name.charAt(0)}
                </div>
                <div className="provider-rating">
                  <i className="fas fa-star"></i> {provider.rating}
                </div>
              </div>
              <div className="provider-body">
                <h4>{provider.name}</h4>
                <div className="provider-service">
                  <span className="badge">{provider.service}</span>
                </div>
                <div className="provider-details">
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{provider.location}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-briefcase"></i>
                    <span>{provider.experience}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{provider.jobs}+ jobs</span>
                  </div>
                </div>
              </div>
              <div className="provider-footer">
                <button className="btn-outline-small">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Bookings Management Component
  const BookingsManagement = () => (
    <div className="section-container">
      <div className="card-panel">
        <div className="card-header">
          <h3><i className="fas fa-tasks"></i> Booking Management</h3>
          <div className="filter-tabs">
            <button className="filter-tab active">All</button>
            <button className="filter-tab">Pending</button>
            <button className="filter-tab">Completed</button>
          </div>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => {
                const statusColor = getStatusColor(booking.status);
                return (
                  <tr key={booking.id}>
                    <td className="booking-id">#{booking.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar" style={{ background: '#e2e8f0', color: '#475569' }}>
                          {booking.user_avatar}
                        </div>
                        <span>{booking.user_name}</span>
                      </div>
                    </td>
                    <td>{booking.provider_name}</td>
                    <td>
                      <div>{booking.date}</div>
                      <small>{booking.time}</small>
                    </td>
                    <td className="amount">{booking.amount}</td>
                    <td>
                      <span className="status-badge" style={{ background: statusColor.bg, color: statusColor.color }}>
                        <span className="status-dot" style={{ background: statusColor.dot }}></span>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="app">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>
              <i className="fas fa-tools"></i>
              <span>Local<span className="highlight">Finder</span></span>
            </h2>
            <p>Admin Console v2.0</p>
          </div>
          <div className="nav-menu">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </div>
            <div className={`nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
              <i className="fas fa-concierge-bell"></i>
              <span>Manage Services</span>
            </div>
            <div className={`nav-item ${activeTab === 'providers' ? 'active' : ''}`} onClick={() => setActiveTab('providers')}>
              <i className="fas fa-hard-hat"></i>
              <span>Service Providers</span>
            </div>
            <div className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              <i className="fas fa-calendar-check"></i>
              <span>Bookings</span>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="footer-item">
              <i className="fas fa-headset"></i>
              <span>Support</span>
            </div>
            <div className="footer-item">
              <i className="fas fa-question-circle"></i>
              <span>Help Center</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <div className="page-title">
              <h1>Welcome back, Admin</h1>
              <p>Here's what's happening with your platform today.</p>
            </div>
            <div className="topbar-actions">
              <button className="notification-btn">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
              <div className="profile-wrapper">
                <div className="profile-logo" ref={profileRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="avatar-icon">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=1f6e5c&color=fff" alt="Admin" />
                  </div>
                  <div className="profile-info">
                    <div className="name">Admin User</div>
                    <div className="role">Super Admin</div>
                  </div>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
                  <div className="dropdown-item">
                    <i className="fas fa-user-circle"></i>
                    <span>My Profile</span>
                  </div>
                  <div className="dropdown-item">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="content-wrapper">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'services' && <ServicesManagement />}
            {activeTab === 'providers' && <ProvidersList />}
            {activeTab === 'bookings' && <BookingsManagement />}
          </div>

          <footer className="footer">
            <p>© 2025 Local Service Finder – Admin Dashboard. All rights reserved.</p>
          </footer>
        </div>

        {/* Modal for Add/Edit Service */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <label>Service Name</label>
                <input
                  type="text"
                  placeholder="e.g., Plumbing, Electrician"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button className="btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveService}>
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
        /* Global Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f7f9fc;
        }

        .app {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f7f9fc;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: #1a1f3a;
          color: #a0aec0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }

        .sidebar-header {
          padding: 28px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
        }

        .sidebar-header h2 .highlight {
          color: #2dd4bf;
        }

        .sidebar-header h2 i {
          font-size: 1.4rem;
          color: #2dd4bf;
        }

        .sidebar-header p {
          font-size: 0.7rem;
          opacity: 0.6;
          margin-top: 8px;
          color: #a0aec0;
        }

        .nav-menu {
          flex: 1;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 18px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #a0aec0;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .nav-item i {
          width: 22px;
          font-size: 1.1rem;
        }

        .nav-item.active {
          background: rgba(45, 212, 191, 0.1);
          color: #2dd4bf;
        }

        .nav-item:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #a0aec0;
        }

        .footer-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: #f7f9fc;
        }

        /* Topbar */
        .topbar {
          background: white;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .page-title h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 4px;
        }

        .page-title p {
          font-size: 0.85rem;
          color: #718096;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          position: relative;
          background: #f1f5f9;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: #e2e8f0;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 20px;
        }

        /* Profile Dropdown */
        .profile-wrapper {
          position: relative;
        }

        .profile-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 12px 6px 6px;
          border-radius: 40px;
          cursor: pointer;
          transition: 0.2s;
          background: #f1f5f9;
        }

        .profile-logo:hover {
          background: #e2e8f0;
        }

        .avatar-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .avatar-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info {
          text-align: right;
        }

        .profile-info .name {
          font-weight: 600;
          font-size: 0.85rem;
          color: #1a202c;
        }

        .profile-info .role {
          font-size: 0.7rem;
          color: #718096;
        }

        .dropdown-menu {
          position: absolute;
          top: 52px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 200px;
          z-index: 100;
          border: 1px solid #e2e8f0;
          display: none;
          overflow: hidden;
        }

        .dropdown-menu.show {
          display: block;
          animation: fadeIn 0.2s ease;
        }

        .dropdown-item {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.1s;
          color: #1a202c;
          font-size: 0.85rem;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
        }

        .dropdown-item.logout {
          color: #ef4444;
          border-top: 1px solid #e2e8f0;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-wrapper {
          flex: 1;
          padding: 24px 32px;
        }

        /* Dashboard Stats */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .stat-info p {
          font-size: 0.85rem;
          color: #718096;
          margin-bottom: 8px;
        }

        .stat-info h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a202c;
        }

        .stat-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper i {
          font-size: 1.6rem;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .card-panel {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge {
          background: #e2e8f0;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          color: #475569;
        }

        /* Chart Styles */
        .chart-container {
          padding: 20px 0;
        }

        .chart-bars {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          gap: 16px;
          min-height: 220px;
        }

        .chart-bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .chart-bar {
          width: 100%;
          max-width: 50px;
          background: linear-gradient(180deg, #2dd4bf, #0d9488);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: height 0.3s ease;
          cursor: pointer;
        }

        .chart-value {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          font-weight: 600;
          color: #0d9488;
        }

        .chart-bar-item span:last-child {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 500;
        }

        /* Recent Bookings */
        .recent-bookings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .recent-booking-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .recent-booking-item:last-child {
          border-bottom: none;
        }

        .recent-booking-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .recent-booking-info {
          flex: 1;
        }

        .recent-booking-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1a202c;
        }

        .recent-booking-detail {
          font-size: 0.75rem;
          color: #718096;
        }

        .recent-booking-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          text-transform: capitalize;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .service-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .service-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .service-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-icon i {
          font-size: 1.5rem;
        }

        .service-info {
          flex: 1;
        }

        .service-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
        }

        .service-id {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .service-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-btn.edit {
          background: #e0f2fe;
          color: #0284c7;
        }

        .icon-btn.edit:hover {
          background: #bae6fd;
        }

        .icon-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .icon-btn.delete:hover {
          background: #fecaca;
        }

        /* Providers Grid */
        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .provider-card {
          background: #f8fafc;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .provider-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .provider-header {
          background: linear-gradient(135deg, #1a1f3a, #2d3748);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .provider-avatar {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .provider-rating {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
        }

        .provider-body {
          padding: 20px;
        }

        .provider-body h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 10px;
        }

        .provider-service {
          margin-bottom: 12px;
        }

        .provider-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #4b5563;
        }

        .detail-item i {
          width: 16px;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .provider-footer {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-outline-small {
          width: 100%;
          padding: 8px;
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.8rem;
          color: #4b5563;
          transition: all 0.2s;
        }

        .btn-outline-small:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 40px;
        }

        .search-box i {
          color: #94a3b8;
        }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          font-size: 0.85rem;
          width: 180px;
        }

        /* Bookings Table */
        .bookings-table-wrapper {
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table th {
          text-align: left;
          padding: 16px 12px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .bookings-table td {
          padding: 16px 12px;
          font-size: 0.85rem;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
        }

        .booking-id {
          font-weight: 600;
          color: #0d9488;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .customer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .amount {
          font-weight: 600;
          color: #1a202c;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-select {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          background: white;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
        }

        .filter-tab {
          padding: 6px 16px;
          border: none;
          background: #f1f5f9;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.75rem;
          color: #64748b;
        }

        .filter-tab.active {
          background: #0d9488;
          color: white;
        }

        /* Buttons */
        .btn-primary {
          background: #0d9488;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #0f766e;
          transform: scale(0.98);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid #cbd5e1;
          padding: 8px 20px;
          border-radius: 40px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: #f1f5f9;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          width: 450px;
          max-width: 90%;
          border-radius: 24px;
          overflow: hidden;
          animation: fadeIn 0.2s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-body label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: #334155;
        }

        .modal-body input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .modal-body input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .footer {
          text-align: center;
          padding: 20px;
          font-size: 0.7rem;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }
          .sidebar-header h2 span,
          .sidebar-header p,
          .nav-item span,
          .sidebar-footer span {
            display: none;
          }
          .nav-item i {
            margin: 0 auto;
          }
          .nav-item {
            justify-content: center;
          }
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
          .content-wrapper {
            padding: 16px;
          }
          .topbar {
            padding: 16px;
          }
          .page-title h1 {
            font-size: 1.2rem;
          }
          .profile-info {
            display: none;
          }
        }
      `}</style>

        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap"
          rel="stylesheet"
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDashboard;