import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/my-orders');
            setOrders(res.data);
        } catch (err) {
            console.error("فشل في جلب طلباتك");
        } finally {
            setLoading(false);
        }
    };


    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        try {
        
            await api.post('/orders/pay', { orderId: selectedOrder._id });
            
            alert("✅ تم الدفع بنجاح! انتقلت ملكية البضاعة إليك.");
            setShowPaymentModal(false);
            fetchOrders(); 
        } catch (err) {
            alert("❌ فشلت عملية الدفع، يرجى المحاولة مرة أخرى.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleResell = (order) => {
        const firstItem = order.items[0]?.product;
        if (firstItem) {
            navigate('/add-product', { 
                state: { 
                    resellData: {
                        title: firstItem.title,
                        description: firstItem.description,
                        ImageUrl: firstItem.ImageUrl,
                        category: firstItem.category,
                        original_f: firstItem.original_f || firstItem.current 
                    }
                } 
            });
        }
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">جاري تحميل سجل مشترياتك...</p>
        </Container>
    );

    return (
        <Container className="py-5">
            <div className="mb-4 d-flex align-items-center justify-content-between border-bottom pb-3">
                <div>
                    <h2 className="fw-bold text-dark mb-1">📦 سجل المشتريات</h2>
                    <p className="text-muted small mb-0">تتبع جميع طلباتك السابقة وحالتها الحالية</p>
                </div>
                <Badge bg="light" text="dark" className="border p-2">
                    عدد الطلبات: {orders.length}
                </Badge>
            </div>

            {orders.length > 0 ? (
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light text-secondary text-uppercase small text-center">
                            <tr>
                                <th className="ps-4 py-3 text-start">المنتج</th>
                                <th>الكمية</th>
                                <th>إجمالي المبلغ</th>
                                <th>حالة الدفع</th>
                                <th>حالة الطلب</th>
                                <th className="pe-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-center">
                            {orders.map(order => (
                                <tr key={order._id} className="border-bottom border-light">
                                    <td className="ps-4 text-start">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={order.items[0]?.product?.ImageUrl || 'https://via.placeholder.com/50'} 
                                                alt="" 
                                                className="rounded-3 shadow-sm me-3"
                                                style={{width: '50px', height: '50px', objectFit: 'cover'}} 
                                            />
                                            <div>
                                                <div className="fw-bold text-dark">{order.items[0]?.product?.title}</div>
                                                <small className="text-muted small">#{order._id.slice(-6).toUpperCase()}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fw-bold">{order.items[0]?.quantity}</span>
                                        <small className="text-muted ms-1">وحدة</small>
                                    </td>
                                    <td className="fw-bold text-success">
                                        {order.totalAmount} د.أ
                                    </td>
                                    <td>
                                        {order.paymentStatus === 'Paid' ? (
                                            <Badge pill bg="success" className="bg-opacity-10 text-success border border-success px-3 py-2">✓ مدفوع</Badge>
                                        ) : (
                                            <Button 
                                                variant="warning" 
                                                size="sm" 
                                                className="fw-bold rounded-pill px-3 shadow-sm"
                                                onClick={() => { setSelectedOrder(order); setShowPaymentModal(true); }}
                                            >
                                                💳 دفع الآن
                                            </Button>
                                        )}
                                    </td>
                                    <td>
                                        <Badge 
                                            pill 
                                            className={`px-3 py-2 ${
                                                order.status === 'Confirmed' ? 'bg-success bg-opacity-10 text-success border border-success' : 
                                                order.status === 'Pending' ? 'bg-warning bg-opacity-10 text-warning border border-warning' : 
                                                'bg-danger bg-opacity-10 text-danger border border-danger'
                                            }`}
                                        >
                                            {order.status === 'Confirmed' ? 'تم القبول' : 
                                             order.status === 'Pending' ? 'قيد الانتظار' : 'مرفوض'}
                                        </Badge>
                                    </td>
                                    <td className="pe-4">
                                     
                                        {order.status === 'Confirmed' && order.paymentStatus === 'Paid' && userRole !== 'Citizen' ? (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="rounded-pill px-3 fw-bold"
                                                onClick={() => handleResell(order)}
                                            >
                                                إعادة طرح ♻️
                                            </Button>
                                        ) : (
                                            <small className="text-muted">--</small>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            ) : (
                <Card className="text-center p-5 border-0 shadow-sm rounded-5">
                    <div className="display-1 opacity-25">🛒</div>
                    <h4 className="mt-3 fw-bold text-muted">سجل مشترياتك فارغ</h4>
                    <p className="text-muted">ابدأ بالتسوق الآن لترى طلباتك هنا!</p>
                    <div className="mt-3">
                        <Button variant="success" onClick={() => navigate('/products')} className="rounded-pill px-4">اذهب للسوق</Button>
                    </div>
                </Card>
            )}


            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered dir="rtl">
                <Modal.Header closeButton className="bg-light border-0 px-4">
                    <Modal.Title className="fw-bold text-success">بوابة الدفع الآمنة</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="text-center mb-4 p-3 bg-light rounded-4">
                        <small className="text-muted d-block">المبلغ المطلوب دفعه</small>
                        <h2 className="fw-bold text-dark mb-0">{selectedOrder?.totalAmount} د.أ</h2>
                    </div>
                    <Form onSubmit={handlePaymentSubmit}>
                        <Form.Group className="mb-3 text-end">
                            <Form.Label className="small fw-bold">رقم البطاقة (Visa / MasterCard)</Form.Label>
                            <Form.Control type="text" placeholder="XXXX XXXX XXXX XXXX" required className="text-center py-2 fs-5" />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-end">
                                    <Form.Label className="small fw-bold">تاريخ الانتهاء</Form.Label>
                                    <Form.Control type="text" placeholder="MM/YY" required className="text-center" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-end">
                                    <Form.Label className="small fw-bold">الرمز (CVC)</Form.Label>
                                    <Form.Control type="text" placeholder="123" required className="text-center" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="success" type="submit" className="w-100 py-3 mt-3 fw-bold shadow-sm border-0 rounded-3" disabled={paymentLoading}>
                            {paymentLoading ? <Spinner size="sm" /> : `تأكيد دفع ${selectedOrder?.totalAmount} د.أ`}
                        </Button>
                        <p className="text-center mt-3 text-muted" style={{fontSize: '0.7rem'}}>
                            🔒 جميع بياناتك مشفرة ومحمية وفق معايير الأمان الدولية
                        </p>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default MyOrders;