import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const PaymentModal = ({ show, handleClose, order, refreshOrders }) => {
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
           
await api.post('/orders/pay', { orderId: selectedOrder._id });
            alert("✅ تمت العملية بنجاح!");
            refreshOrders(); 
            handleClose();
        } catch (err) {
            setError(err.response?.data?.msg || "فشلت عملية الدفع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered dir="rtl">
            <Modal.Header closeButton className="bg-light border-0">
                <Modal.Title className="fw-bold text-success">إتمام الدفع الآمن</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-4 mb-4 text-center">
                    <small className="text-muted d-block">إجمالي المبلغ المطلوب</small>
                    <h2 className="fw-bold text-success mb-0">{order?.totalAmount} د.أ</h2>
                </div>

                {error && <Alert variant="danger" className="py-2 small border-0">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-end">
                        <Form.Label className="small fw-bold text-secondary">رقم البطاقة</Form.Label>
                        <Form.Control 
                            className="bg-light border-0 py-2 text-center fs-5"
                            type="text" placeholder="XXXX XXXX XXXX XXXX" 
                            onChange={(e) => setCardData({...cardData, number: e.target.value})}
                            required maxLength="16"
                        />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 text-end">
                                <Form.Label className="small fw-bold text-secondary">تاريخ الانتهاء</Form.Label>
                                <Form.Control className="bg-light border-0 py-2 text-center" type="text" placeholder="MM/YY" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 text-end">
                                <Form.Label className="small fw-bold text-secondary">الرمز السري (CVC)</Form.Label>
                                <Form.Control className="bg-light border-0 py-2 text-center" type="text" placeholder="123" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="success" type="submit" className="w-100 py-3 rounded-3 fw-bold shadow-sm mt-3 border-0" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : `دفع ${order?.totalAmount} د.أ الآن`}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;