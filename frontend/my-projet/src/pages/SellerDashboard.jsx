import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge, Spinner, Card, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const SellerDashboard = () => {
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchIncomingOrders();
    }, []);

    const fetchIncomingOrders = async () => {
        try {
            const res = await api.get('/orders/incoming'); 
            setIncomingOrders(res.data);
        } catch (err) {
            console.error("خطأ في جلب الطلبات الواردة");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!window.confirm(`هل أنت متأكد من ${newStatus === 'Confirmed' ? 'قبول' : 'رفض'} هذا الطلب؟`)) return;
        
        try {
            await api.put(`/orders/confirm/${orderId}`, { status: newStatus });
            setIncomingOrders(incomingOrders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            alert("فشل في تحديث الحالة");
        }
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="grow" variant="success" />
            <p className="mt-2 text-muted fw-bold">جاري تحميل مبيعاتك...</p>
        </Container>
    );

    return (
        <Container className="py-4">
         
            <div className="mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-success border-5">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h3 className="fw-bold text-dark mb-1">لوحة تحكم المبيعات</h3>
                        <p className="text-muted mb-0">أهلاً بك، إليك ملخص الطلبات الواردة لحسابك كـ ({userRole})</p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Badge bg="success" className="p-2 px-3 rounded-pill shadow-sm">
                            إجمالي الطلبات: {incomingOrders.length}
                        </Badge>
                    </Col>
                </Row>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white py-3 border-bottom border-light">
                    <h5 className="mb-0 fw-bold text-success">
                        <i className="bi bi-cart-check me-2"></i>الطلبات الجديدة
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-secondary small text-uppercase">
                                    <th className="ps-4">رقم الطلب</th>
                                    <th>المشتري</th>
                                    <th>المنتج</th>
                                    <th className="text-center">الكمية</th>
                                    <th className="text-center">الحالة</th>
                                    <th className="pe-4 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomingOrders.map(order => (
                                    <tr key={order._id} className="border-bottom-0">
                                        <td className="ps-4 fw-medium text-primary">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td>
                                            <div className="fw-bold">{order.buyer?.name}</div>
                                            <small className="text-muted">{order.buyer?.role}</small>
                                        </td>
                                        <td>
                                            <span className="fw-bold">{order.items[0]?.product?.title}</span>
                                        </td>
                                        <td className="text-center">
                                            <Badge bg="light" text="dark" className="border">
                                                {order.items[0]?.quantity} {order.items[0]?.product?.units || 'Kg'}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Badge 
                                                pill 
                                                className={`px-3 py-2 ${
                                                    order.status === 'Confirmed' ? 'bg-success bg-opacity-10 text-success border border-success' :
                                                    order.status === 'Cancelled' ? 'bg-danger bg-opacity-10 text-danger border border-danger' :
                                                    'bg-warning bg-opacity-10 text-warning border border-warning'
                                                }`}
                                            >
                                                {order.status === 'Confirmed' ? '✓ مقبول' : 
                                                 order.status === 'Pending' ? '⏳ قيد الانتظار' : '✖ مرفوض'}
                                            </Badge>
                                        </td>
                                        <td className="pe-4">
                                            {order.status === 'Pending' ? (
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        className="rounded-pill px-3 shadow-sm"
                                                        onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                                                    >
                                                        قبول
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="rounded-pill px-3"
                                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                                    >
                                                        رفض
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center text-muted small italic">تمت المعالجة</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    {incomingOrders.length === 0 && (
                        <div className="text-center py-5">
                            <h1 className="display-4 opacity-25">📦</h1>
                            <p className="text-muted fs-5">لا توجد طلبات واردة حالياً.</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SellerDashboard;