import React from 'react'
import { Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AdminAgenceSideBar from '../AdminAgenceSideBar/AdminAgenceSideBar';

function AgenceDashboadLayout() {
  return (
    <section className="container-fluid bg-light min-vh-100">
      <Row>
        <div className="d-none d-lg-block col-md-2 px-0">
          <AdminAgenceSideBar />
        </div>
        <div className="col-12 col-lg-10 px-0">
          <Outlet />
        </div>
      </Row>
    </section>
  )
}

export default AgenceDashboadLayout;