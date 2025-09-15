import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminSidebar() {


    return (
        <div className="flex min-h-screen bg-gray-900 ">

            <div className="bg-gray-800 text-white w-80 p-5 mr-2 ">

                <div className="flex items-center mb-6 ">
                    <img
                        src="Product_Logo.png"
                        alt="logo"
                        className="w-35 h-30 mr-3"
                    />
                    <h2 className="font-bold text-lg ">
                        PRODUCT  MANAGEMENT <br /> SYSTEM
                    </h2>
                </div>

                <hr className="border-gray-600 mb-4" />

                <h5 className="text-gray-400 uppercase mb-3 ml-1">Menu</h5>


                <nav className="flex flex-col">

                    <a href="/admin-products" className="text-lg font-bold hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
                        Products
                    </a>
                    <a href="#" className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
                        Users
                    </a>
                    <a href="/admin-dashboard" className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
                        Dashboard
                    </a>

                    <Link to="/admin-orders">
                        <p className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer" >
                            Orders
                        </p>
                    </Link>

                    <a href="#" className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
                        Settings
                    </a>
                </nav>
            </div>

        </div>
    );
}

export default AdminSidebar;
