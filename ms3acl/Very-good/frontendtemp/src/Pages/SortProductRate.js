import React, { useEffect, useState } from 'react';
import { fetchProductsNoID ,updateProduct} from '../Services/productServices';
import { purchaseProduct } from '../RequestSendingMethods';  // Assuming the function for purchase is imported
import {makePayment} from '../Services/payementServices'
const ProductSort = ({ email, touristId }) => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);  // Toggle for activities
    const [touristWallet, setTouristWallet] = useState(0);  // To store the tourist's wallet balance
    const [purchaseError, setPurchaseError] = useState(""); // To handle errors when purchasing
    console.log('Passing email:', email);  
    useEffect(() => {
        const getProducts = async () => {
            try {
                const Products = await fetchProductsNoID();
                console.log("raw fetch products:", Products);

                if (Products && Products.data) {
                    const sortedProducts = Products.data.sort((a, b) => {
                        const rateA = a.rating;
                        const rateB = b.rating;
                        return rateB - rateA;  // Sort by rating in ascending order
                    });
                    const filteredProducts = sortedProducts.filter(product => {
                        return !product.isArchived;
                    });
                    setProducts(filteredProducts);  // Update state with sorted products
                    console.log('sorted list by rate:', sortedProducts);
                } else {
                    throw new Error("No data found in the response for products sorted by rating.");
                }
            } catch (err) {
                console.error("Error fetching products sorted by rating:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);  // Stop loading for activities
            }
        };

        getProducts();  // Fetch first set of products (sorted by rating)
    });

    // Assuming the wallet balance is fetched here (replace with your logic)
    useEffect(() => {
        const fetchWalletBalance = async () => {
            // Replace this with an actual API call to fetch the tourist's wallet balance
            const touristWalletBalance = 1000; // Mock balance for now
            console.log(touristWallet);
            setTouristWallet(touristWalletBalance);
        };

        fetchWalletBalance();
    }, []);

    const handlePurchase = async (product) => {
        if (touristWallet < product.price) {
            setPurchaseError("Insufficient funds in your wallet.");
            return;
        }

        try {
            const response = await purchaseProduct(email, product._id.toString());
            console.log('product id' , product._id )  ;// Assuming touristEmail is available
            if (response && response.message === "Product purchased successfully") {
                setTouristWallet(prevBalance => prevBalance - product.price); // Deduct product price from wallet
                setPurchaseError("");  // Clear any previous errors
                alert('Product purchased successfully');
                // a call to wassfy 
                console.log("touristId inside productSort :", touristId)
                
                makePayment(touristId, product.price);
            }

            let sellerId = product.sellerId;          
            let productId = product._id;  
            let salesN =  product.sales +1 
            let stockN = product.stock  -1   
            let updatedData = {  
                sales: salesN ,
                stock: stockN       // Replace with the data you want to update
            };

// Using the function to update the product
            updateProduct(sellerId, productId, updatedData)
                .then(updatedProduct => {
                    console.log("Product updated successfully:", updatedProduct);
                    console.log("seller id" , sellerId)
                    console.log("product id" , productId)
                    console.log("stock old" , product.stock , "stock new", stockN)
                    console.log("sales  " , product.sales , "sales new", salesN)
                    console.log("seller id updates" , updatedProduct.sellerId)
                    console.log("product id updates " , updatedProduct.id)
                    console.log("stock old" , product.stock , "stock new U", updatedProduct.stock)
                    console.log("sales old " ,  salesN, "sales new U",salesN)
                    
                })
                .catch(error => {
                    console.error("Error updating product:", error);
                });

                    } catch (err) {
                        setPurchaseError("Error purchasing product: " + err.message);
                    }


                };

    /* const updateProductSales = async (productId) => {
        try {
            const response = await fetch(`/api/products/${productId}/increment-sales`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            console.log("Sales incremented:", data);
            return data;
        } catch (err) {
            console.error("Error updating sales count:", err);
        }
    };*/

    // Toggle function
    const toggleMappings = () => setShowMappings(prevState => !prevState);

    const ProductCard = ({ product }) => {
        return (
            <div className="itinerary-card">
                <h3>{product.name}</h3>
                <p><strong>Description:</strong> {product.description || "No description available"}</p>
                <p><strong>Price:</strong> {product.price} EGP</p>
                <p><strong>Rating:</strong> {product.rating}</p>
                <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>

                {/* Purchase Button */}
                <button onClick={() => handlePurchase(product)} disabled={product.stock <= 0}>
                    {product.stock > 0 ? "Purchase" : "Out of Stock"}
                </button>

                {/* Show error if wallet balance is insufficient */}
                {purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>}
            </div>
        );
    };
    
    return (
        <div className="container">
            <h1>Sort Products</h1>
            <h2>Sorted by Rating</h2>
            
            {/* Toggle Button: Show/Hide Products */}
            <button onClick={toggleMappings}>
                {showMappings ? "Hide Products Sorted by Rating" : "Show Products Sorted by Rating"}
            </button>

            {loading && <p>Loading products sorted by rating...</p>}
            {error && <p>Error: {error}</p>}

            {showMappings && (
                <>
                    <h2>Products Sorted by Rating</h2>
                    {products.length === 0 ? (
                        <p>No products available sorted by rating.</p>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default ProductSort;