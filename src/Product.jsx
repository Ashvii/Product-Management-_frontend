
import React, { useEffect, useState } from 'react';
import { getProducts, productApi } from './Api Service/AllApi';

function Product() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    image: null, // single image
  });



  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, image } = product;

    if (!name || !description || !image) {
      alert('Fill form completely');
      return;
    }
    const reqBody = new FormData();
    reqBody.append("name", name);           // correct
    reqBody.append("description", description); // correct
    reqBody.append("image", image);         // must match Laravel rule
    // Laravel expects "image"

    try {
      const result = await productApi(reqBody, {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });

      if (result.status === 200 || result.status === 201) {
        alert('✅ Product added successfully!');
        console.log(result.data);
        setProduct({ name: '', description: '', image: null });
        setPreviewUrl(null);
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

  const [token, settoken] = useState("")

  const [isModal,setIsModal ] = useState(false)

  useEffect(() => {

    if (localStorage.getItem("token")) {

      const token = localStorage.getItem("token")
      settoken(token)

    }

  }, [])

  return (

    <>

      {!token ? (

        <div className="flex justify-center items-center h-screen">
          <img
            src="error.png"
            alt="page not found"
            className="w-[90%] max-w-[400px]"
          />
        </div>

      ) : (<div className="flex justify-center bg-gray-700 min-h-screen ">
        <div className="flex flex-col items-center justify-center border bg-white p-6 mt-10 rounded-xl m-20">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2 >
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <label className="block mb-1 font-semibold">Product Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={handleUpload}
                required
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
              Add Product
            </button>
          </form>
        </div >
      </div >)
      }

    </>

  );
}

export default Product;
