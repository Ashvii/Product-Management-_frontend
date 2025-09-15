import React, { useEffect, useState, useMemo } from "react";
import SideBar from "./SideBar";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ApprovedOrdersApi,
  CancelOrderApi,
  // ReturnOrderApi
} from "../Api Service/AllApi";

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // Format date as "12 September 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Check if order can be returned (within 1 day after delivery)
  const canReturn = (deliveredOn) => {
    if (!deliveredOn) return false;
    const deliveredDate = new Date(deliveredOn);
    const now = new Date();
    const diffInMs = now - deliveredDate;
    return diffInMs <= 24 * 60 * 60 * 1000; // 1 day
  };

  // Fetch user approved orders
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ApprovedOrdersApi(token);
        const ordersData = res?.data?.data || [];
        // normalize status
        const normalizedOrders = ordersData.map(o => ({
          ...o,
          status: o.status?.toLowerCase(),
        }));
        setOrders(normalizedOrders);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setOrders([]);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Cancel pending order
  const handleCancel = async (orderId) => {
    if (!token) return alert("Unauthorized");
    try {
      const res = await CancelOrderApi(orderId, token);
      const updatedOrder = res.data?.order;
      if (!updatedOrder) return alert("Cancel failed");

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: updatedOrder.status.toLowerCase() } : o
        )
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  // Return delivered order
  // const handleReturn = async (orderId) => {
  //   if (!token) return alert("Unauthorized");
  //   try {
  //     const res = await ReturnOrderApi(orderId, token);
  //     const updatedOrder = res.data?.order;
  //     if (!updatedOrder) return alert("Return failed");

  //     setOrders(prev =>
  //       prev.map(o =>
  //         o.id === orderId ? { ...o, status: updatedOrder.status.toLowerCase() } : o
  //       )
  //     );
  //     alert("Order returned successfully!");
  //   } catch (err) {
  //     console.error(err.response?.data || err.message);
  //     alert(err.response?.data?.message || "Return failed");
  //   }
  // };

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(o =>
      o.id.toString().includes(searchTerm) ||
      o.status?.includes(searchTerm.toLowerCase()) ||
      o.totalprice?.toString().includes(searchTerm) ||
      o.created_at?.includes(searchTerm)
    );
  }, [orders, searchTerm]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <SideBar />
      <div className="flex-1 p-6">
        <div className="p-5 bg-gray-800 rounded-xl mr-10 mt-1 flex-1 h-[680px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBars}
                className="text-xl text-white cursor-pointer m-1"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white px-3 py-2 rounded-xl border border-gray-300 ml-4"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="overflow-y-auto h-[90%] p-4 flex flex-col">
            {loading ? (
              <p className="text-white text-center mt-10">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500 text-center mt-10">{error}</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-white text-center mt-10">No orders found.</p>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-gray-700 text-white rounded-lg shadow-md mt-4 p-4"
                >
                  <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        order.status === "delivered"
                          ? "text-blue-400 font-semibold"
                          : order.status === "cancelled"
                          ? "text-red-500 font-semibold"
                          : "text-yellow-400 font-semibold"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalprice || order.total}
                  </p>
                  <p>
                    <strong>Delivered On:</strong>{" "}
                    {formatDate(order.deliveredOn || order.updated_at)}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    {/* Cancel button for Pending */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                      >
                        Cancel
                      </button>
                    )}
                    {/* Return button for Delivered within 1 day */}
                    {order.status === "delivered" && canReturn(order.deliveredOn || order.updated_at) && (
                      <button
                        // onClick={() => handleReturn(order.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Return
                      </button>
                    )}
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

export default UserOrder;
