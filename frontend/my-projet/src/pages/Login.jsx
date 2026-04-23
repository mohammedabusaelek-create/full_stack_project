import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userId', res.data.user.userId);
            localStorage.setItem('userName', res.data.user.name);

            const role = res.data.user.role;
          
            if (role === 'Farmer') {
                navigate('/dashboard'); 
            } else {
                navigate('/products');
            }

        } catch (err) {
            setError(err.response?.data?.msg || "فشل تسجيل الدخول، تأكد من البيانات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '85vh' }}>
   
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden" style={{ maxWidth: '420px', width: '100%' }}>
                
                <div className="bg-success bg-opacity-10 py-4 text-center border-bottom border-success border-opacity-10">
                    <div className="display-6 mb-2">🌱</div>
                    <h3 className="fw-bold text-success mb-0">مرحباً بك</h3>
                </div>

                <Card.Body className="p-4 p-lg-5">
                    <div className="text-center mb-4">
                        <p className="text-muted small">أدخل بياناتك للوصول إلى حسابك وإدارة مبيعاتك</p>
                    </div>

                    {error && (
                        <Alert variant="danger" className="border-0 rounded-3 py-2 text-center small mb-4 shadow-sm">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleLogin}>
                 
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="small fw-bold text-secondary ps-2">البريد الإلكتروني</Form.Label>
                            <Form.Control 
                                className="bg-light border-0 py-2 rounded-3 shadow-none focus-success"
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </Form.Group>

                   
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label className="small fw-bold text-secondary ps-2">كلمة المرور</Form.Label>
                            <Form.Control 
                                className="bg-light border-0 py-2 rounded-3 shadow-none"
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Button 
                            variant="success" 
                            type="submit" 
                            className="w-100 py-2 rounded-3 fw-bold shadow-sm border-0 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    جاري الدخول...
                                </>
                            ) : 'تسجيل الدخول'}
                        </Button>
                    </Form>

              
                    <div className="text-center mt-4 pt-2 border-top border-light">
                        <p className="small text-muted mb-0">
                            ليس لديك حساب؟ 
                            <Link to="/register" className="text-success fw-bold text-decoration-none ms-1">
                                سجل الآن مجاناً
                            </Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;