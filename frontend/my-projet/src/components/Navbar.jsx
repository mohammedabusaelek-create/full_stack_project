import React from 'react';
import  { useEffect } from 'react'; 
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../App.css";

const NavbarComponent = () => {



    useEffect(() => {
   
        const addGoogleTranslateScript = () => {
            if (!document.getElementById('google-translate-script')) {
                const script = document.createElement('script');
                script.id = 'google-translate-script';
                script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.body.appendChild(script);
            }
            
       
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'ar',
                        includedLanguages: 'en,ar',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                }
            };
        };

        addGoogleTranslateScript();
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        if (window.confirm("هل تريد تسجيل الخروج فعلاً؟")) {
            localStorage.clear(); 
            navigate('/login', { replace: true });
        }
    };

    if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

    return (
        <Navbar bg="white" expand="lg" className="py-2 shadow-sm sticky-top border-bottom border-success border-opacity-25">
            <Container>
            
                <Navbar.Brand as={Link} to="/products" className="fw-bold d-flex align-items-center text-success">
                    <div className="bg-success bg-opacity-10 p-2 rounded-3 me-2">
                        <span style={{ fontSize: '1.2rem' }}>🌾</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span className="lh-1" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>سوق المزارع</span>
                        <small className="text-muted fw-normal" style={{ fontSize: '0.6rem' }}>منصة التوريد الأردنية</small>
                    </div>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                
                <Navbar.Collapse id="basic-navbar-nav">
               
                    <Nav className="mx-auto bg-light rounded-pill px-3 py-1 mt-3 mt-lg-0 gap-1 shadow-sm border" style={{ fontSize: '0.9rem' }}>
                        <Nav.Link 
                            as={Link} 
                            to="/products" 
                            className={`rounded-pill px-3 fw-medium transition-all ${location.pathname === '/products' ? 'bg-success text-white shadow-sm' : 'text-secondary'}`}
                        >
                            السوق
                        </Nav.Link>

                        {(role === 'Farmer' || role === 'Company' || role === 'Merchant') && (
                            <Nav.Link 
                                as={Link} 
                                to="/add-product" 
                                className={`rounded-pill px-3 fw-medium transition-all ${location.pathname === '/add-product' ? 'bg-success text-white shadow-sm' : 'text-secondary'}`}
                            >
                                ➕ إضافة منتج
                            </Nav.Link>
                        )}

                        {(role === 'Farmer' || role === 'Company' || role === 'Merchant') && (
                            <Nav.Link 
                                as={Link} 
                                to="/dashboard" 
                                className={`rounded-pill px-3 fw-medium transition-all ${location.pathname === '/dashboard' ? 'bg-success text-white shadow-sm' : 'text-secondary'}`}
                            >
                                المبيعات
                            </Nav.Link>
                        )}

                        {(role === 'Company' || role === 'Merchant' || role === 'Citizen') && (
                            <Nav.Link 
                                as={Link} 
                                to="/my-orders" 
                                className={`rounded-pill px-3 fw-medium transition-all ${location.pathname === '/my-orders' ? 'bg-success text-white shadow-sm' : 'text-secondary'}`}
                            >
                                مشترياتي
                            </Nav.Link>
                        )}
                    </Nav>

                
                    <Nav className="align-items-center gap-2 mt-3 mt-lg-0">
                        
                  
                        <div id="google_translate_element" className="translate-wrapper shadow-sm rounded-pill border px-2 py-1 bg-white"></div>

                        <div className="d-flex flex-column align-items-end d-none d-lg-flex me-2 ms-2 border-start ps-3">
                            <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{userName}</span>
                            <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                                {role}
                            </Badge>
                        </div>
                        
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={handleLogout} 
                            className="rounded-pill px-3 fw-bold shadow-sm border-0"
                            style={{ fontSize: '0.8rem' }}
                        >
                            خروج
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;