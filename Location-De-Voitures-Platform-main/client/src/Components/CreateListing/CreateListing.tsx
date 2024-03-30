import React from 'react';
import { Form, Button, Container, Nav, NavDropdown, Navbar, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./CreateListing.css";
import { useFormik } from 'formik';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../Configuration/firebase.ts";
import { toast } from 'react-toastify';

interface IImageFile extends File {
    name: string,
}

interface FormValues {
    carName: string;
    carFuel: string;
    carMarque: string;
    carPhotos: string[];
    places: string;
    carType: string;
    carKm: string;
    pricePerDay: string;
    isAvailable: boolean;
    ownerId: string;
    registration: {
        registrationNumber: string;
        registrationDate: string;
        registrationExpiration: string;
        vehicleIdentificationNumber: string;
    };
    insurance: {
        insuranceCompany: string;
        policyNumber: string;
        expirationDate: string;
    };
}

function CreateListing() {
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const [isDisabledMarque, setIsDisabledMarque] = React.useState<boolean>(false);
    const [uploadByte, setUploadByte] = React.useState<number>(0);
    const [imageLoading, setImageLoading] = React.useState<boolean>(false);
    const [files, setFiles] = React.useState<any>([]);
    const [imagesUrl, setImagesUrl] = React.useState<string[]>([]);


    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + values.carPhotos.length < 7) {
            const promises: Promise<string>[] = []; // Define promises array explicitly
            setImageLoading(true);
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImages(files[i]));
            }
            Promise.all(promises).then((urls: string[]) => {
                const updatedValues = {
                    ...values,
                    carPhotos: [...values.carPhotos, ...urls] // Append new image URLs to the existing ones
                };
                setValues(updatedValues); // Update form values
            });
        } else {
            toast.warning("Maximum 7 images");
        }
    }

    const storeImages = async (file: IImageFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadByte(progress);
            }, (error) => {
                reject(error);
                setUploadByte(0);
                setImageLoading(false);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    setUploadByte(0);
                    setImageLoading(false);
                });
            }
            );

        });
    }


    const handleRemoveImage = (index: number) => {
        const updatedPhotos = [...values.carPhotos]; // Create a copy of the carPhotos array
        updatedPhotos.splice(index, 1); // Remove the image URL at the specified index
        const updatedValues = {
            ...values,
            carPhotos: updatedPhotos, // Update carPhotos with the modified array
        }
        setValues(updatedValues); // Set the updated values
    }





    const carMarques: string[] = [
        'Dacia',
        'Renault',
        'Peugeot',
        'Citroën',
        'Volkswagen',
        'Ford',
        'Toyota',
        'Nissan',
        'Hyundai',
        'Kia',
        'Mercedes-Benz',
        'BMW',
        'Audi',
        'Fiat',
        'Opel',
        'Suzuki',
        'Mazda',
        'Volvo',
        'Jeep',
        'Land Rover',
        'Mitsubishi',
        'Lexus',
        'Honda',
        'Subaru',
        'Skoda',
        'Seat',
        'Chevrolet',
        'Tesla',
        'Jaguar',
        'Mini',
        'Alfa Romeo',
        'Porsche',
        'Smart',
        'DS Automobiles',
        'Infiniti',
        'Abarth',
        'Maserati',
        'Bentley',
        'Lamborghini',
        'Ferrari',
        'Bugatti',
        'McLaren',
        'Rolls-Royce',
        'Aston Martin',
        'Acura',
        'Buick',
        'Cadillac',
        'Chrysler',
        'Dodge',
        'GMC',
        'Hummer',
        'Isuzu',
        'Lincoln',
        'Pontiac',
        'Saturn',
        'Saab',
        'Koenigsegg',
        'Lotus',
        'Maybach',
        'Pagani',
        'Spyker',
        'TVR',
        'Vector',
        'Wuling',
        'Zenvo',
        'Geely',
        'BYD',
        'Changan',
        'Great Wall',
        'Haval',
        'JAC Motors',
        'Lifan',
        'Luxgen',
        'Roewe',
        'Brilliance',
        'Chery',
        'Dongfeng',
        'FAW',
        'Haima',
        'MG',
        'Trumpchi',
        'Venucia',
        'Yema',
        'Zotye',
        'BAIC',
        'Landwind',
        'Hongqi',
        'WEY',
        'Wuling'
    ];

    const typesVoitures: string[] = [
        'Berline',
        'SUV',
        'Coupé',
        'Cabriolet',
        'Monospace',
        'Utilitaire',
        'Compacte',
        'Sportive',
        'Tout-terrain',
        'Pick-up',
        'Van',
        'Fourgonnette',
        'Mini-fourgonnette',
        'Limousine'
    ];


    const onSubmit = async (state: any, actions: any) => {

    }

    const { handleSubmit, handleBlur, setValues, handleChange, isSubmitting, values, errors, touched } = useFormik<FormValues>({
        initialValues: {
            carName: '',
            carFuel: '',
            carMarque: '',
            carPhotos: [],
            places: '',
            carType: '',
            carKm: '',
            pricePerDay: '',
            isAvailable: true,
            ownerId: '',
            registration: {
                registrationNumber: '',
                registrationDate: '',
                registrationExpiration: '',
                vehicleIdentificationNumber: ''
            },
            insurance: {
                insuranceCompany: '',
                policyNumber: '',
                expirationDate: ''
            }
        },
        onSubmit,
    });


    return (
        <div className="create-listing-wrapper">
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
                <h1 className="title text-center display-6">Ajouter un Vehicule</h1>
                <Row className="border mx-3 py-4 rounded">
                    <div className="col-12 col-md-6">
                        <Form onSubmit={handleSubmit} className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Nom de voiture</Form.Label>
                                <Form.Control type="text" placeholder="Nom de voiture" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Type du carburant</Form.Label>
                                <Form.Select onClick={() => setIsDisabled(true)}>
                                    <option disabled>Type du carburant</option>
                                    <option>Essence</option>
                                    <option>Diesel</option>
                                    <option>Hybride</option>
                                    <option>Électrique</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Marque du véhicule</Form.Label>
                                <Form.Select onClick={() => setIsDisabledMarque(true)}>
                                    <option disabled>Marque du véhicule</option>
                                    {carMarques.map((elem, index) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Nombre de places</Form.Label>
                                <Form.Control type="number" placeholder="Nombre de places" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Type de voiture</Form.Label>
                                <Form.Select>
                                    <option>Type de voiture</option>
                                    {typesVoitures.map((elem, index) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Kilométrage</Form.Label>
                                <Form.Control type="number" placeholder="Kilométrage" name="km" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Prix par jour (DH)</Form.Label>
                                <Form.Control type="number" placeholder="Prix par jour" name="pricePerDay" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Disponibilité du voiture</Form.Label>
                                <br />
                                <Form.Text>
                                    Vous devez indiquer si votre voiture est disponible ou en charge pour être visible par les clients.
                                </Form.Text>
                                <Form.Select>
                                    <option>État de voiture</option>
                                    <option>Disponible</option>
                                    <option>En Charge</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Numéro d'immatriculation</Form.Label>
                                <Form.Control type="text" placeholder="Numéro d'immatriculation" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Date d'immatriculation</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Date d'expiration de l'immatriculation</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Numéro d'identification du véhicule</Form.Label>
                                <Form.Control type="text" placeholder="Numéro d'identification du véhicule" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Compagnie d'assurance</Form.Label>
                                <Form.Control type="text" placeholder="Compagnie d'assurance" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Numéro de police</Form.Label>
                                <Form.Control type="text" placeholder="Numéro de police" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Date d'expiration de l'assurance</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Button variant="primary" type="submit">Soumettre</Button>
                        </Form>

                    </div>
                    <div className="col-12 col-md-6">
                        <p className="lead text-center text-md-start">Veuillez capturer des images de votre voiture sous différents angles (coffre, avant, arrière, etc...).</p>

                        <Form.Group>
                            <Form.Label>Images</Form.Label>
                            <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)} accept="image/*" multiple />
                            {imageLoading && <p className="text-dark fs-6 text-center pt-2">Loading...</p>}
                            {uploadByte ? <p className="text-dark fs-6 text-center pt-2">upload byte {Math.floor(uploadByte)}%</p> : null}
                            <Button type="button" className="my-3 justify-self-center" onClick={handleImageSubmit}>Télécharger</Button>
                        </Form.Group>

                        <Container>
                            {values.carPhotos.length ? (
                                values.carPhotos.map((elem, index) => {
                                    return (
                                        <div key={index} className="d-flex flex-column justify-between align-center mb-3">
                                            <Image className="rounded mb-2" style={{ height: "auto", maxWidth: "100%" }} src={elem} />
                                            <Button variant="danger" className="align-self-center" style={{ width: "100%", height: "40px" }} onClick={() => handleRemoveImage(index)}>Supprimer</Button>
                                        </div>
                                    );
                                })
                            ) : null}

                        </Container>
                    </div>
                </Row>
            </Container>
        </div>
    )
}

export default CreateListing;
