import React, { useEffect, useState } from 'react';
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideBar from './SideBar';
import { cartProductApi, getProducts } from '../Api Service/AllApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slice/cartSlice';
import RewardPopup from './RewardPopup';

function Main() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [quantities, setQuantities] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch products and token
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (res.status === 200) setProducts(res.data.data);
        else console.error('Failed to fetch products:', res.data.message);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();

    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  // Open popup and initialize quantity
  const openQuantityPopup = (id) => {
    setEditingItemId(editingItemId === id ? null : id);
    if (!quantities[id]) {
      setQuantities((prev) => ({ ...prev, [id]: 1 }));
    }
  };

  // Increment / decrement quantity
  const increment = (id) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      const product = products.find((p) => p.id === id);
      if (!product) return prev;
      if (currentQty < product.quantity) return { ...prev, [id]: currentQty + 1 };
      return prev;
    });
  };

  const decrement = (id) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      if (currentQty > 1) return { ...prev, [id]: currentQty - 1 };
      return prev;
    });
  };

  // Handle Add to Cart
  const handleCart = async (item) => {

    const qty = quantities[item.id] || 1;

    if (!qty) {
      alert("no data found");
    }
    else if (qty > item.quantity) {
      console.log(qty);
      console.log(item.quantities);


      alert('❌ Cannot add more than available stock');
      return;
    }

    try {
      console.log(qty);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('⚠️ You must be logged in to add items to cart.');
        navigate('/');
        return;
      }

      // Call API with token in headers
      const res = await cartProductApi(
        { product_id: item.id, quantity: qty },
        token
      );

      console.log('Add to cart response:', res);

      if (res.status === 201) {
        // Add item to Redux cart
        const cartItemWithImage = {
          ...res.data.cart_item,
          name: item.name,
          images: item.images,
          quantity: qty,
          price: item.price,
        };
        dispatch(addToCart(cartItemWithImage));

        // Update frontend stock
        setProducts(
          products.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity - qty } : p
          )
        );

        // Reset quantity and close popup
        setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
        setEditingItemId(null);

        alert(`✅ Added ${qty} of ${item.name} to cart!`);
      } else {
        const message = res.data?.message || 'Failed to add to cart';
        console.error(message);
        alert(`❌ ${message}`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while adding to cart';
      alert(`❌ ${message}`);

      // Optional: redirect to login if 401
      if (err.response?.status === 401) {
        navigate('/');
      }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex bg-gray-900">
      <SideBar />
      <div className="flex-1 p-6">
        <div className="p-5 bg-gray-800 rounded-xl flex-1 h-[680px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBars} className="text-xl text-white cursor-pointer m-1" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white px-3 py-2 rounded-xl border border-gray-300"
              />
            </div>
            <div className="flex items-center space-x-4 bg-gray-700 p-2 rounded-3xl">
              <div className="flex items-center space-x-2">
                <img src="UserPic.png" alt="User" className="w-12 h-12 rounded-full" />
                <h1 className="text-white font-semibold">User</h1>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
              >
                Logout
              </button>

              <div className="flex items-center space-x-2 m-2 ">
                <img src="reward points.webp" alt="User" className="w-12 h-12 rounded-full" onClick={() => setShowPopup(true)} />


              </div>




              {showPopup && (

               
                  <RewardPopup userId={2} onClose={() => setShowPopup(false)} />
             
              )}



            </div>
          </div>

          <hr />

          {/* Products Header */}
          <div className="flex justify-between">
            <h2 className="text-white text-start font-bold m-5 text-xl">Products</h2>
            <div
              className="cart flex m-5 text-white rounded-4xl p-3 bg-gray-600 cursor-pointer"
              onClick={() => navigate('/cart')}
            >
              <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
            </div>
          </div>

          {/* Product List */}
          <div className="overflow-y-auto h-[70%]">
            {products.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-700 rounded-3xl mt-4 p-4 shadow-md m-5"
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${item.images}`}
                  alt={item.name}
                  className="w-[120px] h-[120px] object-cover rounded-2xl mr-4"
                />
                <div className="flex flex-col flex-grow text-white">
                  <h1 className="text-xl font-semibold">{item.name}</h1>
                  <h2 className="text-gray-300">{item.description}</h2>
                  <h2 className="text-gray-300">${item.price}</h2>
                </div>

                <button
                  className="flex items-center justify-center bg-gray-600 hover:bg-blue-500 rounded-full w-12 h-12 text-white transition"
                  onClick={() => openQuantityPopup(item.id)}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                </button>

                {/* Quantity Popup */}
                {editingItemId === item.id && (
                  <div className="top-full mt-2 center-20 bg-gray-800 p-4 rounded-xl shadow-lg z-50 w-48 m-3">
                    <h1 className="text-white font-semibold">{item.name}</h1>
                    <h2 className="text-gray-300">RATE: ${item.price}</h2>

                    <div className="flex items-center justify-between mt-2">
                      <button
                        className="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600"
                        onClick={() => decrement(item.id)}
                        disabled={(quantities[item.id] || 1) <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center rounded text-black"
                        value={quantities[item.id] || 1}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Math.min(
                              item.quantity,
                              Math.max(1, Number(e.target.value))
                            ),
                          }))
                        }
                      />
                      <button
                        className="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600"
                        onClick={() => increment(item.id)}
                        disabled={(quantities[item.id] || 1) >= item.quantity}
                      >
                        +
                      </button>
                    </div>

                    <h2 className="text-gray-300">
                      TOTAL RATE: ${item.price * (quantities[item.id] || 1)}
                    </h2>

                    <button
                      className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
