import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

import NavbarComponent from './components/Navbar';
import FooterComponent from './components/Footer';


import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/Productlist';
import AddProduct from './pages/AddProduct';
import MyOrders from './pages/Myorder';
import SellerDashboard from './pages/SellerDashboard'; 
import Unauthorized from './pages/Unauthorized';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

    return children;
};

function App() {
    return (
        <Router>
        
            <div className="d-flex flex-column min-vh-100 bg-light shadow-sm">
                
    
                <header className="sticky-top shadow-sm bg-white">
                    <NavbarComponent />
                </header>

            
                <main className="flex-grow-1 py-4 container-fluid px-lg-5">
                    <Routes>
              
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        <Route path="/products" element={
                            <ProtectedRoute allowedRoles={['Farmer', 'Company', 'Merchant', 'Citizen']}>
                                <ProductList />
                            </ProtectedRoute>
                        } />

          
                        <Route path="/add-product" element={
                            <ProtectedRoute allowedRoles={['Farmer', 'Company', 'Merchant']}>
                                <AddProduct />
                            </ProtectedRoute>
                        } />

              
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['Farmer', 'Company', 'Merchant']}>
                                <SellerDashboard />
                            </ProtectedRoute>
                        } />

                    
                        <Route path="/my-orders" element={
                            <ProtectedRoute allowedRoles={['Company', 'Merchant', 'Citizen']}>
                                <MyOrders />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/login" replace />} />
                    
                        <Route path="*" element={
                            <div className="container text-center py-5">
                                <div className="card border-0 shadow-lg p-5 rounded-5">
                                    <h1 className="display-1 fw-bold text-success opacity-25">404</h1>
                                    <h2 className="fw-bold mb-3">عذراً، تِهت في المزرعة؟</h2>
                                    <p className="text-muted fs-5 mb-4">هذه الصفحة غير موجودة حالياً في نظامنا.</p>
                                    <div className="d-flex justify-content-center">
                                        <button 
                                            onClick={() => window.history.back()} 
                                            className="btn btn-outline-success rounded-pill px-4"
                                        >
                                            رجوع للخلف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        } />
                    </Routes>
                </main>

                <FooterComponent />
            </div>
        </Router>
    );
}

export default App;