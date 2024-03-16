import React from "react";
import { Container, Row } from "react-bootstrap";
import "./Payment.css";
import axios, { AxiosResponse } from "axios";


function Payment() {
    React.useEffect(() => {
        const getPayment = async () => {
            const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/agent/payment");
            console.log(res);
        }
        getPayment();
    }, []);
    return (
        <section className="payment-section bg-light py-5">
            <Container>
                <p className="lead text-center py-5">Merci pour votre confience.</p>
                <Row>
                    <div className="payment-division col-11 col-md-7 col-lg-5 col-xlg-4">
                        <h2 className="title text-center">Payment</h2>
                        <h3 className="title text-center">99 HD/mois</h3>

                    </div>
                </Row>
            </Container>
        </section>
    )
}

export default Payment;