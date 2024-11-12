// RotatingImage.js
import React from 'react';
import './RotatingImage.css'; 

const RotatingImage = ({ src, alt }) => {
    return (
        <div className="rotating-image">
            <img src={src} alt={alt} />
        </div>
    );
}

export default RotatingImage;