import React from 'react'
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

function AdminAgenceSideBar() {
    return (
        <Nav className="border d-md-block bg-light sidebar border-right p-0 w-100 min-vh-100">
            <div className="sidebar-sticky d-flex flex-column">
                <h2 className="title text-center pt-4 pb-1">Name</h2>
                <hr className="title" />
                <Nav.Item>
                    <Nav.Link as={Link} to="/agence-dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/agence-dashboard/profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/agence-dashboard/reservations">Reservations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/agence-dashboard/vehicules">Vehicules</Nav.Link>
                </Nav.Item>
            </div>
        </Nav>

    )
}

export default AdminAgenceSideBar;