import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js'; 
import './Dashboard.css';
import RotatingImage from './RotatingImage'; 
import foodImage1 from './food.jpg'; // import your first image
import foodImage2 from './food2.jpg'; // import your second image
import foodImage3 from './food3.jpg'; // import your third image
import foodImage4 from './food4.jpg'; // import your fourth image
import foodImage5 from './food5.jpg'; // import your fifth image

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5300/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    setError(null);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (error) {
                setError('Error fetching products: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const chartData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Quantity',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                type: 'bar',
            },
            {
                label: 'Price',
                data: products.map(product => product.price),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                fill: false,
                type: 'line',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true, 
        maintainAspectRatio: false 
    };

    // Array of images to display
    const foodImages = [foodImage1, foodImage2, foodImage3, foodImage4, foodImage5];

    return (
        <section id="dashboard">
            <div id="stockOverview">
                {isLoading ? (
                    <div>Loading products...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : products.length > 0 ? (
                    <div className="canvas-container">
                        <Bar data={chartData} options={options} />
                    </div>
                ) : (
                    <div>No products available</div>
                )}
                {/* Render images */}
                <div className="image-container">
                    {foodImages.map((src, index) => (
                        <RotatingImage key={index} src={src} alt={`Delicious Food ${index + 1}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;