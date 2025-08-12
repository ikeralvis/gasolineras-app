// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/icon.png';

function Header() {
    return (
        <div className="container mx-auto px-4 mb-8">
            <header className="max-w-4xl mx-auto py-4 px-4 sm:px-6 bg-white shadow-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-inter">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link to="/">
                        <img src={logo} alt="Logo de Gasolineras" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-transform duration-300 transform hover:scale-110" />
                    </Link>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-0">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                Gasolineras España
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Encuentra el mejor precio de combustible</p>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;