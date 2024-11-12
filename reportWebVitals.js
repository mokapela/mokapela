// RotatingImage.js
import React from 'react';
import './RotatingImage.css'; // Add necessary styles

const RotatingImage = ({ src, alt, quantity }) => {
    return (
        <div className="image-wrapper">
            <img src={src} alt={alt} className="rotating-image" />
            {quantity && <div className="quantity-overlay">{quantity}</div>}
        </div>
    );
};

export default RotatingImage;