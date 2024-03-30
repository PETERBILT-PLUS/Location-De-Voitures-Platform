import React from 'react'
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import "./AgenceAdminVehicule.css";
import { Link } from 'react-router-dom';


function AgenceAdminVehicules() {
    return (
        <div>
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

            <div className="py-5 d-flex justify-content-center">
                <Container>
                    <Row xs={1} md={3} className="g-4">
                        <Col>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-primary text-white">Vehicules</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">3 Vehicules</Card.Text>
                                    <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="py-5">
                <Container>
                    <h1 className="text-center title display-6 pb-5 pt-3">Votre Voitures</h1>
                    <Row xs={1} md={3} className="g-4">
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4hDCQsrVcFA00U3O68a8Ea82dwk_v2RQSmwquWotng&s" />
                                <Card.Body>
                                    <Card.Title>Dacia Logan</Card.Title>
                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the
                                        bulk of the card's content.
                                    </Card.Text>
                                    <div className="d-flex gap-3 border-top pt-3">
                                        <button className="edit-car-btn">Modifier</button>
                                        <button className="delete-car-btn">Supprimer</button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>
    );
}

export default AgenceAdminVehicules;