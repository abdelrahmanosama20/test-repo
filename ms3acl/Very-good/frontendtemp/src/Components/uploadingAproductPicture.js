import React, { useState } from 'react';
import axios from 'axios';
import '../styles/global.css'; // Ensure the CSS is being imported

const FetchProducts = ({ sellerEmail }) => {
    const [products, setProducts] = useState([]); // Store fetched product info
    const [error, setError] = useState(null); // Store errors if any
    const [image, setImage] = useState(null); // Store the selected image for upload
    const [selectedProductId, setSelectedProductId] = useState(null); // Store the product ID for which image is being uploaded

    const fetchProductsForSeller = async () => {
        console.log('Seller Email:', sellerEmail);
        try {
            // Step 1: Fetch product IDs for the seller
            const response = await axios.post(`http://localhost:4000/api/sellers/fetchproductsforSpecificSeller/${sellerEmail}`);
            if (response.data.productIds && response.data.productIds.length > 0) {
                const productIds = response.data.productIds;
                const productData = [];

                // Step 2: Loop over product IDs and fetch each product's name
                for (const productId of productIds) {
                    const productResponse = await axios.get(`http://localhost:4000/api/products/fetchproductNameandIDbyID/${productId}`);
                    if (productResponse.data.product) {
                        // Step 3: Add the product name and ID to the list
                        productData.push({
                            productId: productResponse.data.product.productId,
                            productName: productResponse.data.product.productName,
                            pic : productResponse.data.product.pic
                        });
                    }
                }

                // Step 4: Set the state with the fetched product data
                setProducts(productData);
            } else {
                setError('No products found for this seller');
            }
        } catch (err) {
            setError('Error fetching products');
            console.error(err);
        }
    };

    // Handle file input change
    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    // Handle the upload button click for a specific product
    const handleUploadClick = (productId) => {
        setSelectedProductId(productId);
    };

    // Handle form submission to upload the image
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!image || !selectedProductId) {
            return; // Ensure we have an image and selected product
        }

        const formData = new FormData();
        formData.append('photo', image);

        try {
            const response = await axios.post(`http://localhost:4000/api/products/uploadPhoto/${selectedProductId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('Image uploaded successfully!');
                setImage(null);
                setSelectedProductId(null);
            } else {
                alert('Failed to upload image.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image.');
        }
    };

    return (
        <div>
            <button onClick={fetchProductsForSeller}>Fetch Products</button>

            {error && <div>{error}</div>}

            {products.length > 0 && (
                <div>
                    <h2>Product List</h2>
                    {/* Table to display product details */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Product Pic</th>
                                <th>Upload</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.productId}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.pic}</td>
                                    <td>
                                        <button onClick={() => handleUploadClick(product.productId)}>Upload</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal to upload image for selected product */}
                    {selectedProductId && (
                        <div className="upload-modal">
                            <h3>Upload Image for Product ID: {selectedProductId}</h3>
                            <form onSubmit={handleSubmit}>
                                <input type="file" onChange={handleFileChange} required />
                                <button type="submit">Upload</button>
                                <button type="button" onClick={() => setSelectedProductId(null)}>Cancel</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FetchProducts;
