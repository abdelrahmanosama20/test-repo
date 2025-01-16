import React, { useEffect, useState } from 'react';
import {
    fetchSellerByEmail,
    deleteSeller 
} from '../RequestSendingMethods';
import {
    fetchProductsNoID,
    deleteProductsBySeller
} from '../Services/productServices';

const DeleteSeller = ({ email }) => {
    const [products, setProducts] = useState([]); // All products
    const [products2, setProducts2] = useState([]); // Filtered products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isPolling, setIsPolling] = useState(true);

    // Fetch data and user when the email changes
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("Fetching data for email:", email);

            // Fetch user data
            const userResponse = await fetchSellerByEmail(email);
            setUser(userResponse.seller); // Set the user object (seller)

            console.log("User fetched:", userResponse); // Logs complete response with 'seller'
            console.log("User ID", userResponse?.seller?._id);

            // Fetch all products (make sure it's an array)
            const productResponse = await fetchProductsNoID();

            // **DEBUGGING**: Log productResponse to inspect its structure
            console.log("Fetched product response:", productResponse);

            // Ensure productResponse.data is an array or handle it otherwise
            if (Array.isArray(productResponse.data)) {
                setProducts(productResponse.data); // Set products only if it's an array
            } else {
                console.error("Product response is not an array:", productResponse);
                setProducts([]); // Set an empty array in case it's not an array
            }

            // **DEBUGGING**: Log product.sellerId and user.sellerId
            productResponse.data.forEach(product => {
                console.log(`Product sellerId: ${product.sellerId}, User ID: ${userResponse?.seller?._id}`);
            });

            // **DEBUGGING**: Ensure the sellerId values are in string format
            const filteredProducts = productResponse.data.filter(product => {
                const productSellerId = String(product.sellerId); // Convert to string
                const userSellerId = String(userResponse?.seller?._id); // Convert to string

                console.log(`Comparing: ${productSellerId} === ${userSellerId}`); // Check the comparison
                return productSellerId === userSellerId;
            });

            setProducts2(filteredProducts);

            console.log("Filtered products for this seller:", filteredProducts);

        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Poll every 5 seconds based on the email prop
    useEffect(() => {
        fetchData(); // Initial fetch on mount
        // const interval = setInterval(() => {
        //     if (isPolling) {
        //         fetchData(); // Fetch data every 5 seconds if polling is active
        //     }
        // }, 5000); // Poll every 5 seconds
        // // Cleanup polling on unmount
       // return () => clearInterval(interval);
    }, [email]); // Use `email` as the dependency for polling

    // Handle deletion of the user and their products
    const handleDeletion = async () => {
        try {
            if (user) {
                // Delete all products associated with the user
                console.log("to be deleted",products2)
                console.log("to be deleted",products2.length)
                // products2.forEach(product => {
                //   await   deleteProduct(user?._id)
                // });
                await Promise.all(
                    products2.map(async (product) => {
                        await deleteProductsBySeller(user?._id); // Delete products by seller ID
                    })
                );
                // await deleteProductsBySeller(user?._id);
    
                await deleteSeller(String(user?._id))
                alert('Your account has been deleted successfully.');
                setUser(null);
                setProducts([]); // Clear products after deletion
                setProducts2([]); // Clear filtered products
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            setError('Failed to delete account. Please try again later.');
        }
         finally {
        setIsPolling(true); // Resume polling if needed
    }
    };

    // Debugging information for troubleshooting
    const debugInfo = () => {
        console.log("????????????????? Debug Info: ??????????????????");
        console.log("User Data:", user);
        console.log("User ID:", user?._id);  // Access the user ID correctly
        console.log("User products:", products);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Delete Account</h2>
            <button onClick={handleDeletion}>Delete Account</button>
            <button onClick={debugInfo}>Debug Info</button>
        </div>
    );
};

export default DeleteSeller;
