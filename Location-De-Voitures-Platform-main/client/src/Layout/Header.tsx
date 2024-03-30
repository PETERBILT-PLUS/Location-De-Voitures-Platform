import React from 'react';
import { Button, Container, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import CustomNavLink from './CustomNavLink';
import "./LayoutCss/Layout.css";

function Header() {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        })
    }, []);

    const scrollTopFn = () => {
        window.scrollTo(0, 0);
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAccountType = (type: string) => {
        // Handle further action based on account type
        if (type === "agency") {
            navigate("/register-agent");
            setShowModal(false);
        } else {
            navigate("/register");
            setShowModal(false);
        }
    };

    return (
        <header className="header">
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary py-3" variant="light">
                <Container>
                    <button className="scroll-top-btn" style={{ visibility: isVisible ? "visible" : "hidden" }} onClick={scrollTopFn} ><FontAwesomeIcon icon={faArrowAltCircleUp} className="btn-scrollTop" ></FontAwesomeIcon></button>
                    <Navbar.Brand><Link to="/">React-Bootstrap</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="m-auto">
                            <Nav.Link><CustomNavLink to="/" className={({ isActive }) => (isActive ? "link-item-active" : "link-item")}>ACCEUIL</CustomNavLink></Nav.Link>
                            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="gap-4 flex flex-row">
                            <Nav.Link className="text-center align-self-center">Log In</Nav.Link>
                            <button type="button" className="create-account-btn" onClick={handleShowModal}>Crée Un Compte</button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal component moved within the return of Header */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un compte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Voulez-vous créer un compte en tant qu'utilisateur normal ou en tant qu'agence ?</p>
                    <Button variant="primary" onClick={() => handleAccountType('normal')}>Utilisateur</Button>{' '}
                    <Button variant="primary" onClick={() => handleAccountType('agency')}>Agence</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                </Modal.Footer>
            </Modal>
        </header>
    )
}

export default Header;
