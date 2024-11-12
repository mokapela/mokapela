import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

function ProductManagement() {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);
    const [transactionQuantity, setTransactionQuantity] = useState(0);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [sellQuantity, setSellQuantity] = useState(0); // For stock deduction

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5300/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await fetch(`http://localhost:5300/products/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                setIsEditing(false);
                setEditId(null);
            } else {
                await fetch('http://localhost:5300/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            fetchProducts();
        } catch (error) {
            console.error("Failed to submit product:", error);
        }
        
        setProductData({ name: '', description: '', category: '', price: '', quantity: '' });
    };

    const handleEdit = (product) => {
        setProductData(product);
        setIsEditing(true);
        setEditId(product.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await fetch(`http://localhost:5300/products/${id}`, {
                    method: 'DELETE'
                });
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const handleStockTransaction = async (e) => {
        e.preventDefault();
        if (selectedProductId !== null) {
            const updatedQuantity = parseInt(transactionQuantity);
            const currentProduct = products.find(product => product.id === selectedProductId);

            if (!currentProduct) return;

            const newQuantity = currentProduct.quantity + updatedQuantity;

            try {
                await fetch(`http://localhost:5300/products/${selectedProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...currentProduct, quantity: newQuantity })
                });
                setTransactionQuantity(0); 
                setSelectedProductId(null); 
                fetchProducts();
            } catch (error) {
                console.error("Failed to update stock:", error);
            }
        }
    };

    // Handle reducing stock when a product is sold
    const handleSellProduct = async (e) => {
        e.preventDefault();
        if (selectedProductId !== null) {
            const sellAmount = parseInt(sellQuantity);
            const currentProduct = products.find(product => product.id === selectedProductId);

            if (!currentProduct) return;

            // Ensure we don't deduct more than available
            if (sellAmount > currentProduct.quantity) {
                alert("Cannot sell more than the available quantity.");
                return;
            }

            const newQuantity = currentProduct.quantity - sellAmount;

            try {
                await fetch(`http://localhost:5300/products/${selectedProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...currentProduct, quantity: newQuantity })
                });

                setSellQuantity(0); 
                setSelectedProductId(null); 
                fetchProducts();
            } catch (error) {
                console.error("Failed to sell product:", error);
            }
        }
    };

    return (
        <section id="productManagement">
            <h2>Product Management</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                {['name', 'description', 'category'].map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        value={productData[field]}
                        onChange={handleInputChange}
                        required
                    />
                ))}
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={productData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                />
                <button type="submit" className="submit-button">
                    {isEditing ? 'Update Product' : 'Add Product'}
                </button>
            </form>

            <h3>Product List</h3>
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>M{parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.quantity}</td>
                                    <td className="button-container">
                                        <button onClick={() => handleEdit(product)}>Edit</button>
                                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                                        <button onClick={() => { setSelectedProductId(product.id); setTransactionQuantity(0); setSellQuantity(0); }}>Manage Stock</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Stock Form */}
            {selectedProductId !== null && (
                <form className="stock-transaction-form" onSubmit={handleStockTransaction}>
                    <h3>Add Stock for Product ID: {selectedProductId}</h3>
                    <input
                        type="number"
                        value={transactionQuantity}
                        onChange={(e) => setTransactionQuantity(e.target.value)}
                        required
                        min="0"
                        placeholder="Quantity to Add"
                    />
                    <button type="submit">Add Stock</button>
                </form>
            )}

            {/* Sell Stock Form */}
            {selectedProductId !== null && (
                <form className="sell-transaction-form" onSubmit={handleSellProduct}>
                    <h3>Sell Stock for Product ID: {selectedProductId}</h3>
                    <input
                        type="number"
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(e.target.value)}
                        required
                        min="1"
                        placeholder="Quantity to Sell"
                    />
                    <button type="submit">Sell Product</button>
                </form>
            )}
        </section>
    );
}

export default ProductManagement;