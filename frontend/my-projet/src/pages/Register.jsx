import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'Citizen',
        phone: '',
        address: {
            city: 'Amman',
            details: ''
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/register', formData);
            
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.msg || "فشل إنشاء الحساب، تأكد من البيانات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh' }}>
            <Card className="border-0 shadow-lg overflow-hidden rounded-4" style={{ maxWidth: '950px', width: '100%' }}>
                <Row className="g-0 text-end" dir="rtl">
            
                    <Col md={4} className="d-none d-md-flex bg-success align-items-center justify-content-center text-white p-5 flex-column text-center">
                        <div className="display-3 mb-3">🚜</div>
                        <h3 className="fw-bold">سوق المزارع</h3>
                        <p className="opacity-75 small">سلسلة توريد ذكية لربط المنتج بالمستهلك في كافة محافظات المملكة.</p>
                    </Col>

              
                    <Col md={8} className="bg-white p-4 p-lg-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-success">إنشاء حساب جديد</h2>
                            <p className="text-muted small">املأ البيانات المطلوبة للانضمام إلى المنصة</p>
                        </div>

                        {error && (
                            <Alert variant="danger" className="border-0 rounded-3 py-2 text-center small mb-4">
                                ⚠️ {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleRegister}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">الاسم الكامل</Form.Label>
                                        <Form.Control 
                                            className="bg-light border-0 py-2 text-end"
                                            type="text" 
                                            placeholder="أدخل اسمك الكامل" 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">البريد الإلكتروني</Form.Label>
                                        <Form.Control 
                                            className="bg-light border-0 py-2 text-end"
                                            type="email" 
                                            placeholder="name@example.com" 
                                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">رقم الهاتف</Form.Label>
                                        <Form.Control 
                                            className="bg-light border-0 py-2 text-end"
                                            type="text" 
                                            placeholder="07XXXXXXXX" 
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">المحافظة</Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-2 text-end"
                                            value={formData.address.city}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                address: { ...formData.address, city: e.target.value }
                                            })}
                                        >
                                            <option value="Amman">عمان</option>
                                            <option value="Irbid">إربد</option>
                                            <option value="Zarqa">الزرقاء</option>
                                            <option value="Mafraq">المفرق</option>
                                            <option value="Balqa">البلقاء</option>
                                            <option value="Karak">الكرك</option>
                                            <option value="Jerash">جرش</option>
                                            <option value="Ajloun">عجلون</option>
                                            <option value="Madaba">مأدبا</option>
                                            <option value="Aqaba">العقبة</option>
                                            <option value="Ma'an">معان</option>
                                            <option value="Tafilah">الطفيلة</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">تفاصيل العنوان</Form.Label>
                                        <Form.Control 
                                            className="bg-light border-0 py-2 text-end"
                                            type="text" 
                                            placeholder="الشارع، رقم البناء..." 
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                address: { ...formData.address, details: e.target.value }
                                            })}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">كلمة المرور</Form.Label>
                                        <Form.Control 
                                            className="bg-light border-0 py-2 text-end"
                                            type="password" 
                                            placeholder="••••••••" 
                                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4 text-start">
                                        <Form.Label className="small fw-bold text-secondary w-100 text-end">نوع الحساب (الدور)</Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-2 shadow-none cursor-pointer text-end"
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        >
                                            <option value="Citizen">👤 مواطن / مستهلك</option>
                                            <option value="Farmer">👨‍🌾 مزارع</option>
                                            <option value="Company">🏢 شركة زراعية</option>
                                            <option value="Merchant">🏪 تاجر جملة</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className="w-100 fw-bold py-3 rounded-3 shadow-sm border-0 mt-2" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'إنشاء الحساب والتحقق'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4 pt-3 border-top">
                            <span className="small text-muted">لديك حساب بالفعل؟ </span>
                            <Link to="/login" className="text-success fw-bold text-decoration-none small">تسجيل الدخول</Link>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default Register;