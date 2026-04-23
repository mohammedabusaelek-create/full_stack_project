import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-top py-5 mt-auto">
            <Container>
                <Row className="gy-4 align-items-center">
              
                    <Col md={4} className="text-center text-md-start">
                        <h5 className="fw-bold text-success mb-2">🌾 سوق المزارع الأردني</h5>
                        <p className="small text-muted mb-0 lh-lg">
                            منصة ذكية لربط المزارعين بالشركات والتجار لتعزيز الاقتصاد الزراعي الوطني في المملكة الأردنية الهاشمية.
                        </p>
                    </Col>
                    
           
                    <Col md={4} className="text-center">
                        <div className="d-flex justify-content-center gap-3 mb-2">
                            <span className="small text-secondary cursor-pointer hover-success">الرئيسية</span>
                            <span className="text-muted opacity-25">|</span>
                            <span className="small text-secondary cursor-pointer hover-success">عن المنصة</span>
                            <span className="text-muted opacity-25">|</span>
                            <span className="small text-secondary cursor-pointer hover-success">الدعم الفني</span>
                        </div>
                        <div className="text-muted small">نحن هنا لخدمتك 24/7</div>
                    </Col>

            
                    <Col md={4} className="text-center text-md-end">
                        <div className="card bg-light border-0 p-3 rounded-4 shadow-none">
                            <div className="small fw-bold text-dark">
                                جميع الحقوق محفوظة &copy; {currentYear}
                            </div>
                            <div className="text-success small fw-bold mt-1">
                                🎓 جامعة الحسين بن طلال 
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4 text-muted opacity-25" />
                
                <Row>
                    <Col className="text-center">
                        <div className="d-inline-block px-4 py-2 bg-success bg-opacity-10 rounded-pill">
                            <span className="small text-success fw-medium">
                                تم التطوير بكل إتقان بواسطة <span className="fw-bold">فريق العمل</span> ✨
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterComponent;