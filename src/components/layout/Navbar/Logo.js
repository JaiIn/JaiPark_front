import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors">JaiPark</span>
        </Link>
    );
};

export default Logo; 