import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the order details using the orderId prop
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`);
        setOrder(response.data.order); // Set the order data
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Re-fetch when orderId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      {order ? (
        <div>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice}</p>
          <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <h2>Products:</h2>
          <ul>
            {order.products.map((product) => (
              <li key={product._id}>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No order found</p>
      )}
    </div>
  );
};

export default OrderDetails;
