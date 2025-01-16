import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductsNoID ,archiveProduct,unarchiveProduct} from '../Services/productServices';
import ProductSort from '../Components/SortProductRate.js';
import '../Components/ActivityDisplay.css';
import axios from 'axios';

const SellerManagementPage = ({ sellerId }) => {
    const [products, setProducts] = useState([]); // List of products for the seller
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [formData, setFormData] = useState({
        name: '',
        sellerId: sellerId || '', // Ensure sellerId is initialized correctly
        price: '',
        description: '',
        stock: '',
        rating: '',
        sales:''
    }); // Form data for new or updated products
    const [editMode, setEditMode] = useState(false); // Whether we're editing or creating
    const [currentProductId, setCurrentProductId] = useState(null); 
    const [currentSellerId, setSellerProductId] = useState(null); // Product being edited

    // Fetch products for the seller when the component loads
    useEffect(() => {
        const getSellerProducts = async () => {
            try {
                const productsData = await fetchProductsNoID(); // Fetch products based on sellerId
                console.log("productsData", productsData);
                setProducts(productsData.data); // Set products fetched
            } catch (err) {
                setError('Failed to fetch products.');
                console.error(err);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        getSellerProducts();
    },);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission to create or update a product
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.price || !formData.stock || !formData.sellerId) {
            setError('All fields are required.');
            return;
        }

        // Ensure price and stock are valid numbers
        if (isNaN(formData.price) || isNaN(formData.stock)) {
            setError('Price and stock must be valid numbers.');
            return;
        }

        try {
            if (editMode && currentProductId && currentSellerId) {
                // Update product if in edit mode
                await updateProduct(formData.sellerId, currentProductId, { ...formData }); // Pass the productId
                setProducts((prevProducts) =>
                    prevProducts.map((prod) =>
                        prod._id === currentProductId ? { ...prod, ...formData } : prod // Update the product in state
                    )
                );
            } else {
                // Create new product
                const newProduct = await createProduct(formData); // formData includes sellerId
                setProducts((prevProducts) => {
                    if (!Array.isArray(prevProducts)) {
                        return [newProduct]; // Handle case where prevProducts is not an array
                    }
                    return [...prevProducts, newProduct]; // Add new product to the list
                });
            }
            resetForm(); // Reset the form after submit
        } catch (err) {
            setError('Failed to save product. Please check your input.');
            console.error(err);
        }
    };
    const handleArchive = async (productId) => {
        try {
            // Trigger archive operation
            await axios.patch(`http://localhost:4000/api/products/${productId}/archive`);
            // Update product list after successful archive operation
            setProducts((prevProducts) =>
                prevProducts.map((prod) =>
                    prod._id === productId ? { ...prod, isArchived: true } : prod
                )
            );
            console.log(`Product with ID ${productId} archived successfully.`);
        } catch (error) {
            console.error('Error archiving product:', error.response?.data || error.message);
        }
    };
    
    const handleUnarchive = async (productId) => {
        try {
            // Trigger unarchive operation
            await axios.patch(`http://localhost:4000/api/products/${productId}/unarchive`);
            // Update product list after successful unarchive operation
            setProducts((prevProducts) =>
                prevProducts.map((prod) =>
                    prod._id === productId ? { ...prod, isArchived: false } : prod
                )
            );
            console.log(`Product with ID ${productId} unarchived successfully.`);
        } catch (error) {
            console.error('Error unarchiving product:', error.response?.data || error.message);
        }
    };
    

    // Reset the form and toggle off edit mode
    const resetForm = () => {
        setFormData({
            name: '',
            sellerId: sellerId || '', // Reset to the correct sellerId
            price: '',
            description: '',
            stock: '',
            rating: '',
            sales:''
        });
        setEditMode(false);
        setCurrentProductId(null);
        setSellerProductId(null)
    };

    // Edit product
    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            sellerId: product.sellerId || sellerId, // Ensure the sellerId is included
            price: product.price,
            description: product.description,
            stock: product.stock,
            rating: product.rating,
            sales: product.sales
        });
        setEditMode(true);
        setCurrentProductId(product._id);
        setSellerProductId(formData.sellerId) // Store the current product ID for reference
    };

    

    return (
        <div className="itinerary-card">
            <h1>Seller Product Page</h1>
            <h2>{editMode ? 'Edit Product' : 'Create New Product'}</h2>

            {/* Product Form */}
            <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
            />
            <label>ID</label>
            <input
                type="text"
                name="sellerId"
                value={formData.sellerId}
                onChange={handleInputChange}
                required
            />
            <label>Price</label>
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0" // Validation for positive numbers
                step="0.01" // Allows decimal values (e.g., 0.00, 0.01, etc.)
            />
            <label>Description</label>
            <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
            />
            <label>Stock</label>
            <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0" // Validation for positive numbers
            />
            <label>Rating</label>
            <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0" 
                max="5"
                step="0.1" // Allows decimal values (e.g., 0.0, 1.5, etc.)
            />
            <label>sales</label>
            <input
                type="number"
                name="sales"
                value={formData.sales}
                onChange={handleInputChange}
                min="0" 
                
            />


            <button type="submit">{editMode ? 'Update Product' : 'Create Product'}</button>
            {editMode && <button type="button" onClick={resetForm}>Cancel Edit</button>}
        </form>

            <div>
                <ProductSort products={products} setProducts={setProducts} /> {/* Pass products for sorting */}
            </div>
            
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h2>Products List</h2>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="itinerary-card">
                                <h3>{product.name}</h3>
                                <p>Price: {product.price}</p>
                                <p>Description: {product.description}</p>
                                <p>Stock: {product.stock}</p>
                                <p>Rating: {product.rating}</p>
                                <p>Sales: {product.sales}</p>
                                {product.isArchived ? (
                                  
                                  <button onClick={() => handleUnarchive(product._id)}>Unarchive</button>
                                ) : (
                                  <button onClick={() => handleArchive(product._id)}>Archive</button>
                                )}

                                <button onClick={() => handleEdit(product)}>Edit</button>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            )}
        </div>
    );
};


export default SellerManagementPage;