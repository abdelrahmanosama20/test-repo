import React, { useEffect, useState } from 'react';
import { getavailableProducts } from '../Services/productServices'; // Ensure this is the correct path
import axios from 'axios';

const ShowAllProducts = () => {
    const [products, setProducts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch all products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getavailableProducts(); // Call the API to fetch products
                setProducts(data); // Set fetched products in state
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        
        fetchProducts();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Set the selected file
    };

    const handleFileUpload = async (productId) => {
        if (!selectedFile) return alert('Please select a file first');

        const formData = new FormData();
        formData.append('photo', selectedFile); // Append the file to form data

        try {
            setUploading(true);
            const response = await axios.post(
                `http://localhost:4000/api/products/uploadPhoto/${productId}`,
                formData, 
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setUploading(false);

            if (response.data && response.data.product) {
                // Update the product with the new image URL
                const updatedProducts = products.map((product) => 
                    product._id === productId 
                    ? { ...product, pictures: [ ...product.pictures, response.data.product.pictures[0] ] }
                    : product
                );
                setProducts(updatedProducts);
                alert('Image uploaded successfully');
            }
        } catch (error) {
            setUploading(false);
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    return (
        <div className="products-container">
            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>

                        {/* Show the first image URL if available */}
                        {product.pictures && product.pictures.length > 0 && (
                            <div>
                                <p>Current Image:</p>
                                <img
                                    src={product.pictures[0]}
                                    alt="Product"
                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* Upload image functionality */}
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            disabled={uploading} 
                        />
                        <button 
                            onClick={() => handleFileUpload(product._id)} 
                            disabled={uploading || !selectedFile}
                        >
                            {uploading ? 'Uploading...' : 'Upload a Pic'}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ShowAllProducts;
