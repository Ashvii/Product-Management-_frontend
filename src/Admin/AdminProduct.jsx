import { faArrowTrendUp, faBars, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, productApi, updateProductApi, deleteProductApi, updatequantityApi } from '../Api Service/AllApi';

function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null when adding new


    const [product, setProduct] = useState({
        name: '',
        description: '',
        image: null,
        quantity: 0,
        price: 0,  // <-- number instead of empty string
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const [stockModal, setstockModal] = useState(false)

    const handleStock = (product) => {
        setSelectedProduct(product);   // ✅ Set the selected product
        setstockModal(true);          // ✅ Open the modal
    };

    const [selectedProduct, setSelectedProduct] = useState(null);


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct({ ...product, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProduct({ ...product, image: null });
            setPreviewUrl(null);
        }
    };

    const fetchProducts = async () => {
        const res = await getProducts();
        if (res.status === 200) {
            setProducts(res.data.data);
        } else {
            console.error("Failed to fetch products:", res.data.message);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const openAddModal = () => {
        setEditingProduct(null);
        setProduct({ name: '', description: '', image: null, quantity: 0, price: 0 });
        setPreviewUrl(null);
        setIsModal(true);
    };


    const openEditModal = (p) => {
        setEditingProduct(p);
        setProduct({
            name: p.name,
            description: p.description,
            image: null,
            quantity: p.quantity || 0,
            price: p.price != null ? p.price : 0, // fallback to 0
        });
        setPreviewUrl(`http://127.0.0.1:8000/storage/${p.images}`);
        setIsModal(true);
    };


    const closeModal = () => {
        setIsModal(false);
        setEditingProduct(null);
        setProduct({ name: '', description: '', image: null, quantity: 0, price: '' });
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, image, quantity, price } = product;

        if (!name || !description || (!image && !editingProduct)) {
            alert('Please fill in all required fields.');
            return;
        }

        const reqBody = new FormData();
        reqBody.append("name", name);
        reqBody.append("description", description);
        reqBody.append("quantity", quantity);
        reqBody.append("price", price);
        if (image) reqBody.append("image", image);

        try {
            let result;
            if (editingProduct) {
                result = await updateProductApi(editingProduct.id, reqBody, {
                    Authorization: `Bearer ${token}`,
                });
            } else {
                result = await productApi(reqBody, {
                    Authorization: `Bearer ${token}`,
                });
            }

            if (result.status === 200 || result.status === 201) {
                alert(editingProduct ? '✅ Product updated!' : '✅ Product added!');
                closeModal();
                fetchProducts();
            } else {
                alert(result.data.message || 'Something went wrong!');
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let errorMsg = '';
                Object.keys(errors).forEach((field) => {
                    errorMsg += `${field}: ${errors[field].join(', ')}\n`;
                });
                alert(errorMsg);
            } else {
                alert(err.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            const result = await deleteProductApi(id, {
                Authorization: `Bearer ${token}`,
            });
            if (result.status === 200) {
                alert('✅ Product deleted!');
                fetchProducts();
            } else {
                alert(result.data.message || 'Delete failed!');
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("added");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!quantity) {
            setError("Quantity is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const reqBody = {
                quantity: parseInt(quantity),  // Ensure it's an integer
                reason: reason.charAt(0).toUpperCase() + reason.slice(1).toLowerCase(),
                notes: notes || "",           // Avoid undefined notes
            };

            console.log("Payload to be sent:", {
                quantity,
                reason,
                notes
            });

            const response = await updatequantityApi(selectedProduct.id, reqBody, {
                "Content-Type": "application/json",  // Explicitly set content type
            });

            console.log("API response:", response);

            alert("✅ Stock updated successfully!");
            setstockModal(false);  // Close modal
            fetchProducts();       // Refresh product list

        } catch (err) {
            console.error("Error updating quantity:", err);

            if (err.response) {
                console.error("Response data:", err.response.data);
                const message = err.response.data.message || "Validation failed";
                setError(message);
            } else {
                setError(err.message || "Network error");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setstockModal(false);
        setSelectedProduct(null);
    };

    return (
        <div className="p-5 bg-gray-800 rounded-xl mr-10 mt-1 flex-1 p-6 h-[680px]">
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
                        <img
                            src="UserPic.png"
                            alt="User"
                            className="w-12 h-12 rounded-full"
                        />
                        <h1 className="text-white font-semibold">ADMIN</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <hr className="my-4 border-gray-600" />

            {/* Products Header */}
            <div className="flex justify-between items-center">
                <h2 className='text-white text-xl font-bold m-5'>Products</h2>
                <button
                    className='text-white bg-gray-700 p-2 rounded-2xl m-5 hover:bg-gray-600'
                    onClick={openAddModal}
                >
                    ADD
                </button>
            </div>

            {/* Modal */}
            {isModal && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-30 backdrop-blur-sm z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="relative flex flex-col items-center justify-center border bg-white p-6 mt-10 rounded-xl m-4 shadow-lg w-full max-w-md">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-black"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-1 font-semibold">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={product.name}
                                    onChange={(e) =>
                                        setProduct({ ...product, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Description</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={product.description}
                                    onChange={(e) =>
                                        setProduct({ ...product, description: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full border rounded px-3 py-2"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        setProduct({ ...product, quantity: parseInt(e.target.value) || 0 })
                                    }
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Price</label>
                                <input
                                    type="number"
                                    className="w-full border rounded px-3 py-2"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                                    min="0"
                                    required
                                />


                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full"
                                    onChange={handleUpload}
                                />
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-32 h-32 mt-2 object-cover rounded"
                                    />
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-900 transition"
                            >
                                {editingProduct ? "Update Product" : "Add Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="overflow-y-auto h-[70%] p-4">
                {products.map((p) => (
                    <div key={p.id} className="flex bg-gray-700 rounded-2xl mt-4 p-4 items-center hover:shadow-lg transition-shadow">
                        <img
                            src={`http://127.0.0.1:8000/storage/${p.images}`}
                            alt={p.name}
                            className="w-32 h-32 rounded-xl object-cover mr-4"
                        />
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white">{p.name}</h1>
                            <p className="text-gray-300 mt-2">{p.description}</p>

                            <div className="quantity flex space-x-2 text-white">

                                <p className="text-gray-400 ">Quantity: {p.quantity}</p>

                                <button
                                    className='p-1 bg-gray-800 rounded-xl'
                                    onClick={() => handleStock(p)}  // ✅ Pass the product
                                >
                                    <FontAwesomeIcon icon={faArrowTrendUp} />
                                </button>

                            </div>

                            <p className='text-gray-300 mt-2'>{p.price}</p>

                        </div>
                        <div className="flex  space-x-5 text-white text-2xl">


                            <div className="flex-col space-y-20 flex">

                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button
                                    onClick={() => openEditModal(p)}
                                    className=" hover:text-blue-700"
                                    title="Edit"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>


                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {
                stockModal && (

                    <div className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-30 backdrop-blur-sm z-50">
                        <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Adjust Stock</h2>

                            {error && <div className="text-red-600 mb-4">{error}</div>}

                            <label className="block mb-2">Quantity:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full border rounded px-2 py-1 mb-4"
                            />

                            <label className="block mb-2">Reason:</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border rounded px-2 py-1 mb-4"
                            >
                                <option value="added">Added</option>
                                <option value="damaged">Damaged</option>
                                <option value="returned">Returned</option>
                            </select>

                            <label className="block mb-2">Notes:</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border rounded px-2 py-1 mb-4"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>

                )



            }
        </div >
    );
}

export default AdminProduct;
