import { FormikHelpers, useFormik } from "formik";
import { IListing, listingSchema } from "../../Configurations/listingSchema.ts";
import { useGetBrandsAndCategorys } from "../../hooks/useGetBrandsAndCategorys.ts";
import { useEffect, useLayoutEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../../Configurations/firebase";
import { toast } from "react-toastify";
import CustomSubmitButton from "../../SubComponents/CustomSubmitButton/CustomSubmitButton.tsx";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";

interface IImagesFile extends File {
    name: string,
}


function EditProduct() {

    const { brands, categorys } = useGetBrandsAndCategorys();
    const [uploadByte, setUploadByte] = useState<number>(0);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<any>([]);
    const URL = import.meta.env.VITE_SERVER as string;
    const [product, setProduct] = useState<any>({});
    const params = useParams();

    console.log(product);
    

    useLayoutEffect(() => {
        document.title = "Modifier un Produit";
    }, []); 

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + values.images.length < 7) {
            const promises: Promise<string>[] = []; // Define promises array explicitly
            setImageLoading(true);
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImages(files[i]));
            }
            Promise.all(promises).then((urls: string[]) => {
                const updatedValues = {
                    ...values,
                    images: [...values.images, ...urls] // Append new image URLs to the existing ones
                };
                setValues(updatedValues); // Update form values
            });
        } else {
            toast.warning("Maximum 7 images");
        }
    }

    const storeImages = async (file: IImagesFile): Promise<string> => {
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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
                    resolve(downloadURL);
                    setUploadByte(0);
                    setImageLoading(false);
                });
            }
            );

        });
    }

    const handleRemoveImage = (index: number) => {
        const updatedPhotos = [...values.images]; // Create a copy of the carPhotos array
        updatedPhotos.splice(index, 1); // Remove the image URL at the specified index
        const updatedValues = {
            ...values,
            images: updatedPhotos, // Update carPhotos with the modified array
        }
        setValues(updatedValues); // Set the updated values
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/admin/get-single-product?id=${params.id}`);
                if (response.data.success) {
                    console.log(response.data.product);
                    setValues({
                        name: response.data.product.name,
                        description: response.data.product.description,
                        price: response.data.product.price,
                        stock: response.data.product.stock,
                        brand: response.data.product.brand.name,
                        category: response.data.product.category,
                        images: response.data.product.images
                    });
                    setProduct(response.data.product);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error("An Error Happend");
                }
            }
        }
        getProduct();
    }, []);

    const onSubmit = async (values: IListing, actions: FormikHelpers<IListing>) => {
        const newData = {
            _id: params.id,
            name: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            brand: values.brand,
            category: values.category,
            images: values.images
        };

        console.log(newData);

        try {
            const response: AxiosResponse<any, any> = await axios.put(`${URL}/admin/update-product`, newData, { withCredentials: true });
            if (response.data.success) {
                toast.success("Produit Améliorer avec Succès");
                actions.resetForm();
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                toast.error("An Error Happend");
            }
        }
    };


    const { handleSubmit, handleBlur, handleChange, setValues, isSubmitting, values, errors, touched } = useFormik<IListing>({
        validationSchema: listingSchema,
        initialValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            brand: "",
            category: "",
            images: [],
        },
        onSubmit,
    });
    console.log(errors);
    

    return (
        <div className="bg-slate-100 py-24 min-h-screen">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2">


                    <div className="flex flex-col justify-evenly items-start">
                        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-evenly items-start gap-2 w-full px-12">
                            <label htmlFor="name">Nom:</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} className="w-52 px-2 py-1 rounded-md" name="name" id="name" placeholder="Nom" value={values.name} />
                            {touched.name && errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

                            <label htmlFor="description">Déscription:</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.description} className="w-52 px-2 py-1 rounded-md" name="description" id="description" placeholder="Déscription" />
                            {touched.description && errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}

                            <label htmlFor="price">Prix:</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.price} className="w-52 px-2 py-1 rounded-md" name="price" id="price" placeholder="Prix:" />
                            {touched.price && errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}

                            <label htmlFor="category">Categoty:</label>
                            <select onChange={handleChange} name="category" id="category" value={values.category} onBlur={handleBlur} className="w-52 px-2 py-1 rounded-md" defaultValue="">
                                <option value="" disabled>Category</option>
                                {categorys?.map((elem: any, index: number) => {
                                    return (
                                        <option key={index} value={elem.categoryName} >{elem.categoryName}</option>
                                    );
                                })}
                            </select>
                            {touched.category && errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}

                            <label htmlFor="brand">Brand:</label>
                            <select className="w-52 px-2 py-1 rounded-md" onChange={handleChange} onBlur={handleBlur} name="brand" id="brand" value={values.brand} defaultValue="">
                                <option value="" disabled>Brand:</option>
                                {brands.map((elem: any, index: number) => {
                                    return (
                                        <option key={index} value={elem.name}>{elem.name}</option>
                                    );
                                })}
                            </select>
                            {touched.category && errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}

                            <label htmlFor="stock">Stock:</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.stock} className="w-52 px-2 py-1 rounded-md" name="stock" id="stock" placeholder="Stock" />
                            {touched.stock && errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}

                            <CustomSubmitButton value="Enregistrer" loading={isSubmitting} disabled={isSubmitting} />
                        </form>
                    </div>

                    <div className="px-4 py-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Les Images</h2>
                        <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)} accept="image/*" multiple className="mb-4" />
                        {imageLoading && <p className="text-gray-800 text-sm mb-4">Loading...</p>}
                        {uploadByte ? <p className="text-gray-900 text-sm mb-4">Upload byte {Math.floor(uploadByte)}%</p> : null}
                        <button type="button" className="btn-primary mb-4" onClick={handleImageSubmit}>Télécharger</button>
                        {errors.images && touched.images && <p className="text-red-500 text-sm">{errors.images}</p>}

                        <div className="grid grid-cols-2 gap-4">
                            {values?.images?.length ? (
                                values.images.map((elem, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <img className="rounded mb-2" style={{ maxHeight: "200px", width: "100%" }} src={elem} alt={`Image ${index}`} />
                                        <button className="btn-secondary text-slate-900" onClick={() => handleRemoveImage(index)} type="button">Supprimer</button>
                                    </div>
                                ))
                            ) : null}
                        </div>
                    </div>




                </div>
            </div>
        </div>
    )
}

export default EditProduct;