import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Logo from './Logo';
import SearchBar from './SearchBar';
import AuthLinks from './AuthLinks';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/posts?search=${encodeURIComponent(searchKeyword.trim())}`);
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Logo />
                    <SearchBar 
                        searchKeyword={searchKeyword}
                        onSearchChange={e => setSearchKeyword(e.target.value)}
                        onSearchSubmit={handleSearch}
                    />
                    <div className="flex items-center space-x-4">
                        <AuthLinks 
                            isAuthenticated={isAuthenticated}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 