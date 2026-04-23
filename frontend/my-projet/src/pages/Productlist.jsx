import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({}); 
    const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchProducts = async () => {
        
        if (userRole === 'Farmer') {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/products');
      
            const filtered = res.data.filter(product => {
                if (userRole === 'Company') return product.current?.role === 'Farmer';
                if (userRole === 'Merchant') return product.current?.role === 'Company';
                if (userRole === 'Citizen') return product.current?.role === 'Merchant';
                return false; 
            });
            setProducts(filtered);
        } catch (err) {
            setError("فشل في جلب البيانات");
        } finally {
            setLoading(false);
        }
    };
    fetchProducts();
}, [userRole]);

    const handleBuy = async (product) => {
        const qty = quantities[product._id] || 1; 
        if (qty > product.quantity) {
            alert(`عذراً، الكمية المتاحة فقط هي ${product.quantity}`);
            return;
        }
        try {
            const orderData = {
                seller: product.current._id,
                items: [{
                    product: product._id,
                    quantity: parseInt(qty), 
                    priceAtPurchase: product.price
                }],
                totalAmount: product.price * qty,
                transactionType: userRole === 'Company' ? 'F-C' : userRole === 'Merchant' ? 'C-M' : 'M-Cit'
            };
            await api.post('/orders', orderData);
            alert("✅ تم إرسال طلب الشراء بنجاح!");
            setQuantities({ ...quantities, [product._id]: 1 });
        } catch (err) {
            alert("خطأ في الطلب: " + (err.response?.data?.msg || "الكمية غير متوفرة"));
        }
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="grow" variant="success" />
            <p className="text-muted mt-3 fw-bold">جاري تجهيز المنتجات الطازجة...</p>
        </Container>
    );

    return (
        <Container className="py-4">
  
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 p-4 bg-white shadow-sm rounded-4 border-bottom border-success border-4">
                <div>
                    <h2 className="fw-bold text-success mb-1">🛒 سوق المنتجات الزراعية</h2>
                    <p className="text-muted mb-0">تسوّق أفضل المحاصيل مباشرة من المصدر</p>
                </div>
                <Badge bg="dark" className="p-3 rounded-pill shadow-sm mt-3 mt-md-0">
                    👤 دورك الحالي: {userRole}
                </Badge>
            </div>

            {error && <Alert variant="danger" className="rounded-4 shadow-sm border-0">{error}</Alert>}

            <Row>
                {products.length > 0 ? products.map(product => (
                    <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative product-card-hover">
                            
                 
                            <div className="position-absolute top-0 start-0 m-3 z-index-2">
                                <Badge bg="success" className="fs-6 shadow-sm px-3 py-2 rounded-pill">
                                    {product.price} د.أ
                                </Badge>
                            </div>

                   
                            <div className="overflow-hidden" style={{ height: '200px' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={product.ImageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                    className="h-100 w-100 object-fit-cover transition-transform"
                                    style={{ transition: 'transform 0.3s ease' }}
                                />
                            </div>

                            <Card.Body className="d-flex flex-column p-3">
                                <Card.Title className="fw-bold text-dark text-truncate mb-1">
                                    {product.title}
                                </Card.Title>
                                
                     
                                <div className="mb-3 d-flex align-items-center text-secondary small">
                                    <span className="me-1">📍</span>
                                    <span className="fw-bold text-success">{product.current?.name || "بائع غير معروف"}</span>
                                </div>

                          
                                <div className="mb-3 d-flex flex-wrap gap-1">
                                    <Badge pill bg="light" text="dark" className="border px-2 py-1">
                                        {product.category}
                                    </Badge>
                                    <Badge pill bg="warning" text="dark" className="bg-opacity-25 px-2 py-1">
                                        📦 متاح: {product.quantity} {product.unit}
                                    </Badge>
                                </div>

                                <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ height: '40px', overflow: 'hidden' }}>
                                    {product.description || "لا يوجد وصف متوفر لهذا المنتج الزراعي."}
                                </Card.Text>

                                <hr className="my-2 opacity-25" />
                                
                       
                                <div className="mt-2">
                                    <div className="d-flex align-items-center justify-content-between mb-3 bg-light p-2 rounded-3">
                                        <small className="fw-bold text-muted ms-1">الكمية:</small>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={quantities[product._id] || 1}
                                            onChange={(e) => setQuantities({
                                                ...quantities,
                                                [product._id]: e.target.value
                                            })}
                                            className="form-control-sm border-0 bg-transparent text-center fw-bold"
                                            style={{ width: '70px', boxShadow: 'none' }}
                                        />
                                    </div>
                                    <Button 
                                        variant="success" 
                                        className="w-100 py-2 rounded-3 fw-bold shadow-sm transition-all"
                                        onClick={() => handleBuy(product)}
                                    >
                                        إتمام الطلب
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : (
                    <Col xs={12} className="text-center py-5">
                        <div className="card border-0 shadow-sm rounded-5 p-5 bg-white">
                            <h1 className="display-1 opacity-25">🌾</h1>
                            <h4 className="text-muted mt-3">لا توجد منتجات متاحة لهذه الفئة حالياً</h4>
                            <p className="small text-secondary">يرجى التحقق من وقت لاحق أو التواصل مع الإدارة</p>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default ProductList;