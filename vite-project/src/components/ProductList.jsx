import React from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Product List</h3>
      {products.length > 0 ? (
        <ul>
         {products.map((product) => (
            <li key={product.id}>
            <div>
            <h4>{product.Name}</h4>
            <p>{product.Description}</p>
            <p>Price: ₱{product.Price}</p>
            <p>Stock: {product.Stock}</p>
            <p>Category: {product.Category}</p>
            <p>Image: <img src={product.ImageUrl} alt={product.Name} style={{ width: '50px' }} /></p>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => onDelete(product.id)}>Delete</button>
            </div>
            <hr />
        </li>
))}

        </ul>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;
