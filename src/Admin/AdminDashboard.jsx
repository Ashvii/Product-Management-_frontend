import React from 'react'
import AdminSidebar from './AdminSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-900">
            <AdminSidebar />

            <div className="flex-1 p-6">

                <div className="p-5 bg-gray-800 rounded-xl mr-10 mt-1 flex-1 p-6 h-[680px]">


                    <div className="flex justify-between">

                        <div className="name">

                            <h1 className='text-white text-3xl font-bold'>Product List</h1>
                            <h5 className='text-white '>here you can find your products</h5>

                        </div>

                        <div className="add justify-end text-white m-5 text-3xl shadow-2xl border border-gray-900 bg-gray-900  rounded-xl">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>

                    </div>

                    <div className="details m-5 flex justify-evenly text-white">

                        <div className="totalproduct text-center">
                            <h1 className='text-6xl'>4</h1>
                            <h4>Total Products</h4>
                        </div>

                        <hr className="w-px h-22 bg-white border-0 " />

                        <div className="stockproducts text-center">
                            <h1 className='text-6xl'>4</h1>
                            <h4>stock products</h4>
                        </div>

                        <hr className="w-px h-22 bg-white border-0" />

                        <div className="outofstock text-center">
                            <h1 className='text-6xl'>4</h1>
                            <h4>out of stock</h4>
                        </div>


                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="py-2 px-4 text-left">ID</th>
                                    <th className="py-2 px-4 text-left">Product Name</th>
                                    <th className="py-2 px-4 text-left">Price</th>
                                    <th className="py-2 px-4 text-left">Stock</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                <tr className="border-b border-gray-600">
                                    <td className="py-2 px-4">1</td>
                                    <td className="py-2 px-4">Apple iPhone 15</td>
                                    <td className="py-2 px-4">$999</td>
                                    <td className="py-2 px-4">

                                        <select
                                            className="bg-gray-700 text-white px-2 py-1 rounded m-2"
                                        >
                                            <option>In Stock</option>
                                            <option>Out of Stock</option>
                                        </select>

                                    </td>

                                    <td className="py-2 px-4">
                                        <span className="px-2 py-1 rounded-full text-sm bg-green-500">   <select >
                                            <option value="active" className=' text-sm bg-green-500'>Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select></span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-600">
                                    <td className="py-2 px-4">2</td>
                                    <td className="py-2 px-4">Samsung Galaxy S24</td>
                                    <td className="py-2 px-4">$899</td>
                                    <td className="py-2 px-4">
                                        <select
                                            className="bg-gray-700 text-white px-2 py-1 rounded m-2"
                                        >
                                            <option>In Stock</option>
                                            <option>Out of Stock</option>
                                        </select></td>
                                    <td className="py-2 px-4">
                                        <span className="px-2 py-1 rounded-full text-sm bg-red-500"><select >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>








                </div>



            </div>
        </div>
    )
}
