import React, { useState } from 'react';
import { filterProductsByPrice } from '../RequestSendingMethods'; // Import the request sending method

const FilterProductByPrice = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');

  const handleFilterSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(''); // Reset error message

    // Call the request sending method
    try {
      const products = await filterProductsByPrice({ minPrice, maxPrice });
      setFilteredProducts(products.data); // Set the filtered products
    } catch (err) {
      setError(err.message); // Handle errors
    }
  };

  return (
    <div className="filter-product-by-price">
      <h1>Filter Products by Price</h1>
      <form onSubmit={handleFilterSubmit}>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Minimum Price"
          required
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Maximum Price"
          required
        />
        <button type="submit">Filter Products</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Render filtered products */}
      <div className="filtered-products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
              <h2>{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
              {/* Render more product details as needed */}
            </div>
          ))
        ) : (
          <p>No products found within this price range.</p>
        )}
      </div>
    </div>
  );
};

export default FilterProductByPrice;
