import React from "react";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div className="bg-gray-800 text-white w-80 p-5 mr-2 min-h-screen">
      {/* Logo Section */}
      <div className="flex items-center mb-6">
        <img
          src="Product_Logo.png"
          alt="logo"
          className="w-12 h-12 mr-3"
        />
        <h2 className="font-bold text-lg leading-tight">
          PRODUCT MANAGEMENT <br /> SYSTEM
        </h2>
      </div>

      <hr className="border-gray-600 mb-4" />

      {/* Menu */}
      <h5 className="text-gray-400 uppercase mb-3 ml-1">Menu</h5>

      <nav className="flex flex-col space-y-2">
        <Link
          to="/main"
          className="text-lg font-bold hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
        >
          Products
        </Link>

        <Link
          to="/cart"
          className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
        >
          Cart
        </Link>

        <Link
          to="/explore"
          className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
        >
          Explore
        </Link>

        <Link
          to="/userOrder"
          className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
        >
          Orders
        </Link>

        <Link
          to="/settings"
          className="text-lg hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default SideBar;
