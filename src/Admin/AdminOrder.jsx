import React, { useEffect, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import {
  OrderApi,
  ApproveOrderApi,
  CancelOrderApi,
  ApprovedOrdersApi
} from '../Api Service/AllApi';

function AdminOrder() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Fetch all orders and merge approved orders for status
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
    if (!savedToken) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const orderRes = await OrderApi(savedToken);
        const approvedRes = await ApprovedOrdersApi(savedToken);

        if (orderRes?.status !== 200 || approvedRes?.status !== 200) {
          console.error('Failed to fetch data');
          return;
        }

        const approvedOrders = approvedRes.data.data;
        const mergedOrders = orderRes.data.data.map(order => {
          const approved = approvedOrders.find(a => a.order_id === order.id);
          return {
            ...order,
            status: approved ? approved.status.toLowerCase() : 'pending'
          };
        });

        setOrders(mergedOrders);
      } catch (err) {
        console.error('API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Approve order
  const handleApprove = async (orderId) => {
    if (!token) return alert('Unauthorized');

    try {
      const res = await ApproveOrderApi(orderId, token);
      const updatedOrder = res.data?.data;

      if (!updatedOrder) return alert('Order approved successfully!');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status.toLowerCase() }
            : order
        )
      );
      alert('Order approved successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to approve order');
    }
  };

  // Cancel order
  const handleCancel = async (orderId) => {
    if (!token) return alert('Unauthorized');

    try {
      const res = await CancelOrderApi(orderId, token);
      const updatedOrder = res.data?.data;

      if (!updatedOrder) return alert('Order cancelled successfully!');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status.toLowerCase() }
            : order
        )
      );
      alert('Order cancelled successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  // Filtered orders by search
  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="p-5 bg-gray-800 rounded-xl mr-10 mt-1 flex-1 h-[680px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBars} className="text-xl text-white cursor-pointer m-1" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white px-3 py-2 rounded-xl border border-gray-300 ml-4"
              />
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Orders List */}
          <div className="overflow-y-auto h-[80%] p-4 mt-4">
            {loading ? (
              <p className="text-white text-center mt-10">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-white text-center mt-10">No orders found.</p>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row bg-gray-500 rounded-2xl mt-4 p-4 items-center md:items-start"
                >
                  {/* Order Info */}
                  <div className="flex-1 p-4 text-center bg-gray-800 m-2 rounded-xl">
                    <h1 className="text-xl font-bold text-white">{order.name}</h1>
                    <div className="flex justify-center space-x-4 mt-2 text-gray-400">
                      <p>Quantity: {order.quantity}</p>
                      <p>Total Price: $ {parseFloat(order.totalprice).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md text-center text-white mt-4 md:mt-0 md:ml-4">
                    <h1 className="text-2xl font-bold mb-4">Order Status</h1>
                    <p className="text-gray-300 mb-6">
                      Current Status:{' '}
                      <span
                        className={
                          order.status === 'delivered'
                            ? 'text-green-400'
                            : order.status === 'cancelled'
                              ? 'text-red-400'
                              : 'text-yellow-400'
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        className={`rounded-xl px-6 py-2 transition ${
                          order.status === 'delivered' || order.status === 'cancelled'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gray-500 hover:bg-green-600'
                        }`}
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={order.status === 'cancelled' || order.status === 'delivered'}
                        className={`rounded-xl px-6 py-2 transition ${
                          order.status === 'cancelled' || order.status === 'delivered'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gray-500 hover:bg-red-600'
                        }`}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
