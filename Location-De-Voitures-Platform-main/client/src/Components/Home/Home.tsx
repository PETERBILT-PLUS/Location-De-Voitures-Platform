import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Spinner, Row, Col, Form } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { carMarques, moroccanCities, typesVoitures } from "../../Configuration/values.ts";
import "./Home.css";
import { toast } from 'react-toastify';

interface IVehicle {
    _id: string;
    carEtat: string;
    carFuel: string;
    carKm: number;
    carMarque: string;
    carPhotos: string[];
    carType: string;
    insurance: {
        expirationDate: Date;
        insuranceCompany: string;
        policyNumber: string;
    };
    places: number;
    registration: {
        registrationDate: Date;
        registrationExpiration: Date;
        registrationNumber: string;
        vehicleIdentificationNumber: string;
    };
    ownerId: string;
    // Add more fields as needed
}

function Home() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [nextCursor, setNextCursor] = useState<string | undefined>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<Object>({});

    console.log(nextCursor);

    // Fetch vehicles data
    const fetchVehicles = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response: AxiosResponse<any, any> = await axios.get(`http://localhost:5000/user?cursor=${nextCursor || ''}`);
            const { vehicles: newVehicles, nextCursor: newNextCursor } = response.data;

            setVehicles((prevVehicles) => [...prevVehicles, ...newVehicles]);
            setNextCursor(newNextCursor);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message || 'Error fetching vehicles');
                console.error('Error fetching vehicles:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []); // Run only on component mount

    const loadMoreVehicles = useCallback(() => {
        if (nextCursor) {
            fetchVehicles();
        }
    }, [nextCursor, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            setFilter({ [e.target.name]: e.target.value });
        } catch (error) {

        }
    }

    return (
        <section className="cars-section py-5 min-h-100">
            <Container className="mt-5">
                <Row>
                    <Col md={{ span: 4, order: 'last' }} lg={3} className="py-3 d-none d-md-block">
                        <div className="rounded bg-light py-4 px-3">
                            <h3 className="title fs-3 filter-title">Filter</h3>
                            <div className="text-center w-50" style={{ backgroundColor: "var(--lightBlue)", height: "1px", borderRadius: "5px" }} />
                            <Form.Group className="py-3">
                                <h4 className="title py-3">Marque</h4>
                                <Form.Select className="w-75" defaultValue="">
                                    <option value="" disabled>Marque du Voiture</option>
                                    {carMarques.map((elem: string, index: number) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <h4 className="title py-3">Carburant</h4>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="group1" id="group1" />
                                    <Form.Check className="px-2">Essence</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="group1" id="group1" />
                                    <Form.Check className="px-2">Diesel</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="group1" id="group1" />
                                    <Form.Check className="px-2">Hybrid</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="group1" id="group1" />
                                    <Form.Check className="px-2">Electrique</Form.Check>
                                </Form.Label>
                            </Form.Group>

                            <Form.Group className="py-3">
                                <h4 className="title py-3">Ville</h4>
                                <Form.Select className="w-75" defaultValue="">
                                    <option value="" disabled>Ville</option>
                                    {moroccanCities.map((elem: string, index: number) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <h4 className="title py-3">Type de Voiture</h4>
                                <Form.Select defaultValue="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}>
                                    <option value="" disabled>Type De Voiture</option>
                                    {typesVoitures.map((elem: any, index: number) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Col>
                    <Col md={8} lg={9}>
                        <InfiniteScroll
                            dataLength={vehicles.length}
                            next={loadMoreVehicles}
                            hasMore={!nextCursor} // Check if there's a nextCursor
                            loader={<div key={0} className="text-center"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>}
                            endMessage={<p className="text-center w-100">No more vehicules to load.</p>}
                            className="row w-100"
                        >
                            {vehicles.map((vehicle) => (
                                <Col xs={12} lg={6} key={vehicle._id}>
                                    <Card className="my-3" style={{ width: "100%" }}>
                                        <Card.Img variant="top" src={vehicle.carPhotos[0]} style={{ height: '300px', objectFit: 'cover' }} />
                                        <Card.Body>
                                            <Card.Text>{vehicle.carMarque}</Card.Text>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </InfiniteScroll>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Home;
