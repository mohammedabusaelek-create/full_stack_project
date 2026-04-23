import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleGoBack = () => {
    
        if (role === 'Farmer') {
            navigate('/farmer-dashboard');
        } else {
            navigate('/products');
        }
    };

    return (
        <Container className="text-center mt-5">
            <div className="p-5 shadow-sm rounded bg-light">
                <h1 className="display-1 text-danger fw-bold">403</h1>
                <h2 className="mb-4">دخول غير مصرح به!</h2>
                <p className="text-muted mb-4 fs-5">
                    عذراً، أنت لا تملك الصلاحيات اللازمة للوصول إلى هذه الصفحة. 
                    هذا القسم مخصص لرتب أخرى في نظام سلسلة التوريد.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        الرجوع للخلف
                    </Button>
                    <Button variant="success" onClick={handleGoBack}>
                        الذهاب لصفحتي الرئيسية
                    </Button>
                </div>
            </div>
            <div className="mt-4">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/752/752755.png" 
                    alt="Access Denied" 
                    style={{ width: '100px', opacity: 0.5 }}
                />
            </div>
        </Container>
    );
};

export default Unauthorized;