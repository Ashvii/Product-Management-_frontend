import React, { useEffect, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideBar from "./SideBar";
import { useSelector, useDispatch } from "react-redux";
import {
  removeCartItem,
  emptyCart,
  setCart,
  updateCartQuantity,
} from "../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  checkoutApi,
  getRewardPointsApi,
  redeemPointsApi,
} from "../Api Service/AllApi";
import RewardPopup from "./RewardPopup";

function Cart() {
  const dispatch = useDispatch();
  const cartArray = useSelector((state) => state.cartReducer);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [total ,settotal ] = useState(0)

  // Reward states
  const [points, setPoints] = useState(0);
  const [redeemInput, setRedeemInput] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [redeemApplied, setRedeemApplied] = useState(false);

  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t) setToken(t);

    if (u) {
      const userObj = JSON.parse(u);
      setUserId(userObj.id);
      setPoints(parseFloat(userObj.total_reward_points) || 0);
    }
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        if (res.status === 200) setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Restore cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (savedCart.length > 0) dispatch(setCart(savedCart));
  }, [dispatch]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartArray));
  }, [cartArray]);

  // Fetch reward points from backend
  const fetchPoints = async () => {
    if (!userId) return;

    try {
      const res = await getRewardPointsApi(userId);
      const totalPoints = parseFloat(res.data.total_points) || 0;
      setPoints(totalPoints);

      // Update localStorage user object
      const userObj = JSON.parse(localStorage.getItem("user"));
      if (userObj) {
        userObj.total_reward_points = totalPoints;
        localStorage.setItem("user", JSON.stringify(userObj));
      }
    } catch (err) {
      console.error("Reward API error:", err);
      setPoints(0);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [userId]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    dispatch(emptyCart());
    navigate("/");
  };

  // Update quantity
  const updateQuantity = (cartItemId, value) => {
    const cartItem = cartArray.find((i) => i.id === cartItemId);
    if (!cartItem) return;

    const product = products.find((p) => p.id === cartItem.product_id);
    const stock = product ? parseInt(product.quantity || 1) : 1;
    const quantity = Math.max(1, Math.min(value, stock));
    dispatch(updateCartQuantity({ id: cartItemId, quantity }));
  };

  // Cart totals
  const totalProducts = cartArray.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 0),
    0
  );

  const subtotal = cartArray.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0);
  
  
  const grandTotal = Math.max(0, subtotal - discount);
  console.log(`grandtotal is ${grandTotal}`);

  

  // Redeem points
  const handleRedeem = async () => {
    if (!userId) return;
    if (redeemInput < 50) return alert("Minimum 50 points required");
    if (redeemInput > points) return alert("Not enough points");

    try {
      const res = await redeemPointsApi(userId, redeemInput);
      if (res.data?.success) {
        setDiscount(res.data.discount);
        setRedeemApplied(true);
        setPoints(res.data.remaining_points);

        // Update localStorage user
        const userObj = JSON.parse(localStorage.getItem("user"));
        if (userObj) {
          userObj.total_reward_points = res.data.remaining_points;
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      } else {
        alert(res.data?.message || "Redeem failed");
      }
    } catch (err) {
      console.error("Redeem error:", err);
      alert("Redeem failed. Please try again.");
    }
  };

  const handleRemoveRedeem = () => {
    setDiscount(0);
    setRedeemInput(0);
    setRedeemApplied(false);
    fetchPoints();
  };

  // Checkout
// Checkout
const handleCheckout = async () => {
  if (cartArray.length === 0) {
    alert("Cart is empty");
    return;
  }

  const items = cartArray.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  try {
    const res = await checkoutApi({
      items,            
      discount,
      redeemed_points: redeemApplied ? redeemInput : 0,
    });

    if (res.status === 200 || res.status === 201) {
      alert("Checkout successful!");
      dispatch(emptyCart());
      localStorage.removeItem("cartItems");
      setRedeemApplied(false);
      setDiscount(0);
      setRedeemInput(0);

      await fetchPoints(); // refresh points after checkout
      navigate("/main");
    } else {
      alert(res.data?.message || "Checkout failed");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    if (err.response?.status === 401) handleLogout();
    else alert(err.response?.data?.message || "Checkout failed");
  }
};

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="error.png"
          alt="page not found"
          className="w-[90%] max-w-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <SideBar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="p-5 bg-gray-800 rounded-xl mr-10 mt-1 flex-1">
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBars}
                className="text-xl text-white cursor-pointer m-1"
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white px-3 py-2 rounded-xl border border-gray-300"
              />
            </div>

            <div className="flex items-center space-x-4 bg-gray-700 p-2 rounded-3xl">
              <div className="flex items-center space-x-2">
                <img
                  src="UserPic.png"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <h1 className="text-white font-semibold">User</h1>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>

            <div className="flex items-center space-x-2 m-2">
              <img
                src="reward points.webp"
                alt="Reward Points"
                className="w-12 h-12 rounded-full cursor-pointer"
                onClick={() => setShowPopup(true)}
              />
            </div>

            {showPopup && (
              <RewardPopup
                userId={userId}
                fetchPoints={fetchPoints}
                onClose={() => setShowPopup(false)}
              />
            )}
          </div>
        </div>

        <hr className="my-4" />
        <h2 className="text-white text-start font-bold m-5 text-xl">Products</h2>

        {/* Cart Items */}
        {loading ? (
          <p className="text-white m-5">Loading products...</p>
        ) : cartArray.length > 0 ? (
          cartArray.map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            if (!product) return null;
            const stock = parseInt(product.quantity || 0);
            const limitReached = item.quantity > stock;

            return (
              <div
                key={item.id}
                className="productCard flex bg-gray-700 rounded-4xl mt-4 p-4"
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${item.images}`}
                  alt={item.name}
                  className="w-[120px] h-[120px] object-cover rounded-2xl mr-4"
                />
                <div className="flex flex-col flex-grow text-white">
                  <h1 className="text-xl font-semibold">{item.name}</h1>
                  <h2 className="text-gray-300">{item.description}</h2>
                  <h2 className="text-gray-300">
                    Price: ${parseFloat(item.price).toFixed(2)}
                  </h2>
                  {limitReached && (
                    <p className="text-red-400 mt-1 font-semibold">Limit reached</p>
                  )}

                  {/* Quantity controls */}
                  <div className="mt-2 flex items-center space-x-2">
                    <label className="text-gray-200">Qty:</label>
                    <div className="flex items-center space-x-1">
                      <button
                        className="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={stock}
                        value={item.quantity}
                        className="w-16 p-1 rounded text-black text-center"
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                      />
                      <button
                        className="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <h2 className="text-gray-300 mt-1">
                    TOTAL: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </h2>
                  <button
                    className="mt-2 bg-gray-500 px-3 py-1 rounded-xl hover:bg-gray-900 w-[50%]"
                    onClick={() => dispatch(removeCartItem(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white m-5">Your cart is empty.</p>
        )}

        {/* Cart Summary */}
        {cartArray.length > 0 && (
          <div className="shadow-2xl p-5 mt-5 bg-gray-500 rounded-3xl">
            <h1 className="text-center text-2xl">Cart Summary</h1>
            <h4 className="mt-3">Total Products: {totalProducts}</h4>
            <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
            <h4>Discount: -${discount.toFixed(2)}</h4>
            <h4 className="font-bold text-lg">Grand Total: ${grandTotal.toFixed(2)}</h4>

            {/* Redeem Section */}
            <div className="mt-4">
              <p>You have {points} points</p>
              {!redeemApplied ? (
                <>
                  <input
                    type="number"
                    value={redeemInput}
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 0;
                      if (val > points) val = points;
                      setRedeemInput(val);
                    }}
                    className="border p-2 rounded text-black"
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded ml-2"
                    onClick={handleRedeem}
                  >
                    Apply
                  </button>
                  {redeemInput > 0 && (
                    <p className="mt-2 text-sm text-white">
                      Discount: ${(redeemInput / 10).toFixed(2)}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-green-200">
                    ✅ {redeemInput} points applied ($
                    {(redeemInput / 10).toFixed(2)} discount)
                  </p>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded mt-2"
                    onClick={handleRemoveRedeem}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={cartArray.length === 0}
              className="bg-gray-600 mt-5 p-4 w-full text-white hover:border hover:border-gray-600"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
