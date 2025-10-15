import React, { useState } from 'react';

// Header Component
export const Header: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.25-.94-6-4.27-6-8.5V8.3l6-3.11v15.31z"/>
                                <path d="M13 8h-2v4H7v2h4v4h2v-4h4v-2h-4V8z"/>
                            </svg>
                        </div>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-800">Health Care System</h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-12">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
                        <a href="#" className="text-sm font-semibold text-gray-900 border-b-2 border-blue-600 pb-1">
                            Manage Resource Allocation
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Appointments</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Scan Health Card</a>
                    </nav>

                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};