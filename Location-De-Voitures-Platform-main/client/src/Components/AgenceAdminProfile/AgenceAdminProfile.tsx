import React from 'react';
import { Button, Col, Container, Form, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import SubmitButton from '../../SubComponents/SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';

function AgenceAdminProfile() {

    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);

    const cities: string[] = [
        "Agadir",
        "Al Hoceima",
        "Asilah",
        "Azemmour",
        "Azrou",
        "Beni Mellal",
        "Ben Slimane",
        "Berkane",
        "Berrechid",
        "Casablanca",
        "Chefchaouen",
        "Dakhla",
        "El Aioun",
        "El Hajeb",
        "El Jadida",
        "El Kelaa des Sraghna",
        "Errachidia",
        "Essaouira",
        "Fes",
        "Guelmim",
        "Ifrane",
        "Khemisset",
        "Khenifra",
        "Khouribga",
        "Laayoune",
        "Larache",
        "Marrakech",
        "Meknes",
        "Mohammedia",
        "Nador",
        "Ouarzazate",
        "Ouezzane",
        "Oujda",
        "Rabat",
        "Safi",
        "Sale",
        "Sefrou",
        "Settat",
        "Sidi Bennour",
        "Sidi Ifni",
        "Sidi Kacem",
        "Sidi Slimane",
        "Skhirat",
        "Tangier",
        "Tan-Tan",
        "Taourirt",
        "Taroudant",
        "Taza",
        "Tetouan",
        "Tiznit",
        "Zagora"
    ];

    return (
        <div className="px-0">
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
            <Row className="py-5 justify-content-center w-100">
                <Col xs={11} md={7} lg={5} className="justify-self-center">
                    <Form className="border rounded px-4 py-2">
                        <Form.Group className="py-2" controlId="formNom">
                            <Form.Label className="pt-2">Nom :</Form.Label>
                            <Form.Control type="text" placeholder="Votre nom" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formPrenom">
                            <Form.Label className="pt-2">Prénom :</Form.Label>
                            <Form.Control type="text" placeholder="Votre prénom" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formEmail">
                            <Form.Label className="pt-2">E-mail :</Form.Label>
                            <Form.Control type="email" placeholder="Votre e-mail" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formPassword">
                            <Form.Label className="pt-2">Mot de passe :</Form.Label>
                            <Form.Control type="password" placeholder="Votre mot de passe" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formConfirmPassword">
                            <Form.Label className="pt-2">Confirmer votre mot de passe :</Form.Label>
                            <Form.Control type="password" placeholder="Confirmer votre mot de passe" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formPhoneNumber">
                            <Form.Label className="pt-2">Téléphone :</Form.Label>
                            <Form.Control type="tel" placeholder="Votre téléphone" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formAddress">
                            <Form.Label className="pt-2">Adresse :</Form.Label>
                            <Form.Control type="text" placeholder="Votre adresse" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formCity">
                            <Form.Label className="pt-2">Ville :</Form.Label>
                            <Form.Select className="form-select" onClick={() => setIsDisabled(true)} /*onChange={handleChange} onBlur={handleBlur} name="city" value={values.city}*/>
                                <option disabled={isDisabled}>Choisir La Ville</option>
                                {cities.map((elem, idx) => (
                                    <option key={idx}>{elem}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formWebsite">
                            <Form.Label className="pt-2">Site Web :</Form.Label>
                            <Form.Control type="text" placeholder="Votre site Web" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formRegistrationNumber">
                            <Form.Label className="pt-2">Numéro d'inscription :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro d'inscription" />
                        </Form.Group>


                        <Form.Group className="py-2" controlId="formBusinessLicenseNumber">
                            <Form.Label className="pt-2">Numéro de licence commerciale :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de licence commerciale" />
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formInsurancePolicyNumber">
                            <Form.Label className="pt-2">Numéro de police d'assurance :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de police d'assurance" />
                        </Form.Group>

                        <SubmitButton disabled={false} loading={false} />
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AgenceAdminProfile;
