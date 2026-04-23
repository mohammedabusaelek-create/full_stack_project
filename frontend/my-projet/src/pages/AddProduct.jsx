import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [productData, setProductData] = useState({
        title: '',
        category: 'Vegetables',
        description: '',
        ImageUrl: '',
        quantity: '',
        units: 'Kg',
        price: '',
        original_f: null 
    });

    useEffect(() => {
        if (location.state && location.state.resellData) {
            const data = location.state.resellData;
            setProductData(prev => ({
                ...prev,
                title: data.title,
                description: data.description,
                ImageUrl: data.ImageUrl,
                category: data.category,
                original_f: data.original_f
            }));
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/products/add', productData);
            alert("✅ تم نشر المنتج في السوق بنجاح!");
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.msg || "حدث خطأ أثناء إضافة المنتج");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>
                <Row className="g-0">
           
                    <Col lg={5} className="bg-light d-flex align-items-center justify-content-center border-end p-4">
                        <div className="text-center w-100">
                            <h6 className="text-muted mb-3 fw-bold">معاينة الصورة</h6>
                            {productData.ImageUrl ? (
                                <div className="position-relative">
                                    <img 
                                        src={productData.ImageUrl} 
                                        alt="Preview" 
                                        className="img-fluid rounded-4 shadow-sm transition-all" 
                                        style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }} 
                                    />
                                    <Badge bg="success" className="position-absolute top-0 end-0 m-2 p-2 shadow-sm rounded-pill">
                                        صورة نشطة
                                    </Badge>
                                </div>
                            ) : (
                                <div className="py-5 border border-2 border-dashed rounded-4 bg-white text-muted">
                                    <div className="display-1 opacity-25">🖼️</div>
                                    <p className="small mt-2">يرجى وضع رابط الصورة بالأسفل</p>
                                </div>
                            )}
                        </div>
                    </Col>

           
                    <Col lg={7}>
                        <Card.Body className="p-4 p-lg-5 bg-white">
                            <div className="mb-4">
                                <h3 className="fw-bold text-dark mb-1">
                                    {location.state?.resellData ? '♻️ إعادة طرح للمنتج' : '🥦 إضافة محصول جديد'}
                                </h3>
                                <p className="text-muted small">أدخل تفاصيل بضاعتك بدقة لتسهيل وصول المشترين إليك</p>
                            </div>

                            {location.state?.resellData && (
                                <Alert variant="success" className="border-0 bg-success bg-opacity-10 text-success small py-2 rounded-3 mb-4">
                                    ✨ تم استيراد البيانات الأصلية. فقط حدد سعرك وكميتك.
                                </Alert>
                            )}

                            {error && <Alert variant="danger" className="border-0 small py-2 rounded-3 mb-4">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-secondary">رابط صورة المنتج</Form.Label>
                                    <Form.Control 
                                        className="bg-light border-0 py-2 rounded-3 shadow-none"
                                        type="text" 
                                        placeholder="https://example.com/image.jpg" 
                                        value={productData.ImageUrl}
                                        onChange={(e) => setProductData({...productData, ImageUrl: e.target.value})}
                                        required
                                    />
                                </Form.Group>

                                <Row className="g-3">
                                    <Col md={7}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">اسم المحصول</Form.Label>
                                            <Form.Control 
                                                className="bg-light border-0 py-2 rounded-3"
                                                type="text" 
                                                value={productData.title}
                                                onChange={(e) => setProductData({...productData, title: e.target.value})} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">التصنيف</Form.Label>
                                            <Form.Select 
                                                className="bg-light border-0 py-2 rounded-3 shadow-none"
                                                value={productData.category}
                                                onChange={(e) => setProductData({...productData, category: e.target.value})}
                                            >
                                                <option value="Vegetables">🥦 خضروات</option>
                                                <option value="Fruits">🍎 فواكه</option>
                                                <option value="Leafy">🌿 ورقيات</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">الكمية</Form.Label>
                                            <Form.Control 
                                                className="bg-light border-0 py-2 rounded-3"
                                                type="number" 
                                                value={productData.quantity}
                                                onChange={(e) => setProductData({...productData, quantity: e.target.value})} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">الوحدة</Form.Label>
                                            <Form.Select 
                                                className="bg-light border-0 py-2 rounded-3 shadow-none"
                                                value={productData.units}
                                                onChange={(e) => setProductData({...productData, units: e.target.value})}
                                            >
                                                <option value="Kg">كيلو (Kg)</option>
                                                <option value="Box">صندوق (Box)</option>
                                                <option value="Ton">طن (Ton)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-secondary">السعر الجديد</Form.Label>
                                            <Form.Control 
                                                className="bg-light border-0 py-2 rounded-3 text-success fw-bold"
                                                type="number" 
                                                step="0.01" 
                                                placeholder="د.أ"
                                                value={productData.price}
                                                onChange={(e) => setProductData({...productData, price: e.target.value})} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-secondary">وصف إضافي</Form.Label>
                                    <Form.Control 
                                        className="bg-light border-0 py-2 rounded-3"
                                        as="textarea" 
                                        rows={2} 
                                        placeholder="مثلاً: جودة عالية، قطاف اليوم..."
                                        value={productData.description}
                                        onChange={(e) => setProductData({...productData, description: e.target.value})} 
                                    />
                                </Form.Group>

                                <Button variant="success" type="submit" className="w-100 py-3 rounded-3 fw-bold shadow-sm border-0 transition-all" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            جاري النشر...
                                        </>
                                    ) : (
                                        '✓ نشر المنتج في السوق'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default AddProduct;