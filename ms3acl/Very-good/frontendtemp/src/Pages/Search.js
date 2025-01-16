import React, { useState } from 'react';
import {searchbyname} from '../Services/productServices';
import {getavailableProducts} from '../Services/productServices';

const Search = () => {
    console.log("aywa hya deh el page el bt3ml el bali balak");
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState(null);
    const [products, setProducts] = useState([]);
    const [Availableproducts, setAvailableProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false); // State to control the visibility of products
    const [availableproductError, setAvailableProductError] = useState(null);
    const [loadingAvailableProducts, setLoadingAvailableProducts] = useState(false);


    const handleSearchProductbyname = async () => {
        
        setLoadingProducts(true);
        setProductError(null);
        try {
            const productsResults = await searchbyname({name : productSearchTerm} ); // Search for activities
            setProducts(productsResults);
        } catch (err) {
            setProductError('Failed to fetch activities');
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingAvailableProducts(true); // Set loading state correctly
        setAvailableProductError(null); // Reset the error state
        try {
            const products = await getavailableProducts(); // Fetch the available products
            setAvailableProducts(products); // Update the state with the fetched products
        } catch (error) {
            setAvailableProductError(error.message); // Handle errors
        } finally {
            setLoadingAvailableProducts(false); // Reset loading state
        }
    };
    
    // Handle button click to show available products
    const handleShowProducts = () => {
        fetchProducts();
        setShowProducts(true); // Show products when button is clicked
    };



    return (
        <div>
            <h1>Welcome, Admin!</h1>

            {/* Search box for products */}
        <div>
            <h2>Search products</h2>
            <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Search products by name"
            />
            <button onClick={handleSearchProductbyname}>Search Products by name</button>
            {loadingProducts && <p>Loading Products...</p>}
            {productError && <p>{productError}</p>}
            <div>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>{product.name}</h3>
                    <p><strong>Price:</strong> ${product.price}</p>
                    {product.description && <p><strong>Description:</strong> {product.description}</p>}
                    <p><strong>Stock:</strong> {product.stock} units</p>
                    <p><strong>Rating:</strong> {product.rating}/5</p>
                    {product.sellerId && <p><strong>Seller:</strong> {product.sellerId.name}</p>} {/* Ensure sellerId has a 'name' field in your data */}
                    {product.pictures && product.pictures.length > 0 && (
                    <div>
                        <strong>Pictures:</strong>
                        <ul>
                            {product.pictures.map((picture, index) => (
                                <li key={index}>
                                    <img src={picture} alt={`Picture of ${product.name}`} style={{ width: '100px' }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ))
    ) : (
        !loadingProducts && <p>No products found.</p>
    )}
            </div>
        </div>
        <div>
    <h2>Available Products</h2>
    <button onClick={handleShowProducts}>Show Available Products</button>
    {loadingAvailableProducts && <p>Loading available products...</p>}
    {availableproductError && <p>{availableproductError}</p>}
    <div>
        {Availableproducts.length > 0 ? ( // Use Availableproducts instead of products
            Availableproducts.map((product) => ( // Map over the correct state variable
                <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>{product.name}</h3>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Stock:</strong> {product.stock} available</p>
                    <p><strong>Rating:</strong> {product.rating}/5</p>
                    {product.sellerId && <p><strong>Seller:</strong> {product.sellerId.name}</p>}
                    {product.pictures && product.pictures.length > 0 && (
                        <div>
                            <strong>Pictures:</strong>
                            <ul>
                                {product.pictures.map((picture, index) => (
                                    <li key={index}>
                                        <img src={picture} alt={`Picture of ${product.name}`} style={{ width: '100px' }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))
        ) : (
            !loadingAvailableProducts && <p>No products available.</p>
        )}
                </div>
            </div>
        </div>
);
};

export default Search;
