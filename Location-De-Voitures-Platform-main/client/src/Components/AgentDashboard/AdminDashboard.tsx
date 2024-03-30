import React from 'react';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Container, Nav, NavDropdown, Navbar, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="bg-light">
            <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#features">Fonctionnalités</Nav.Link>
                            <Nav.Link href="#pricing">Tarification</Nav.Link>
                            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                                <NavDropdown.Item>Action</NavDropdown.Item>
                                <NavDropdown.Item><Link style={{ textDecoration: "none" }} to="/agence-dashboard/create-listing">Ajouter Un Vehicule</Link></NavDropdown.Item>
                                <NavDropdown.Item>Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <Button variant="outline-light">Déconnexion</Button> {/* Logout button */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="py-5">
                <h4 className="text-center mb-4">Bienvenue, Mr Name</h4>
                <p className="text-center mb-5">Veillez accepter les réservations et voir vos messages depuis votre tableau de bord.</p>
                <Row xs={1} md={3} className="g-4">
                    <Col>
                        <Card className="shadow h-100">
                            <Card.Header className="py-3 text-center bg-primary text-white">Reservations</Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <Card.Text className="mb-0">5 Réservations</Card.Text>
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-muted mt-3 fs-4" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow h-100">
                            <Card.Header className="py-3 text-center bg-secondary text-white">Vehicules</Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <Card.Text className="mb-0">3 Vehicules</Card.Text>
                                <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow h-100">
                            <Card.Header className="py-3 text-center bg-danger text-white">Notifications</Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <Card.Text className="mb-0">7 Nouvelles</Card.Text>
                                <FontAwesomeIcon icon={faBell} className="text-muted mt-3 fs-4" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminDashboard;
