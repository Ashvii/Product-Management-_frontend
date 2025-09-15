import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../Api Service/AllApi"; // Adjust path
import { commonApi } from "../Api Service/commonApi";


function Auth() {
 const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userDetails;

    if (!email || !password) {
      alert("Please enter complete details");
      return;
    }

    try {
      setLoading(true);
      const result = await commonApi("POST", "/api/login", { email, password });

      if (result.status === 200) {
        const { user, access_token } = result.data;

        // Save token and user info
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login successful");
        setUserDetails({ email: "", password: "" });

        // Redirect based on role/email
        if (user.email === "admin@example.com") {
          navigate("/admin-home");
        } else {
          navigate("/main");
        }
      } else {
        alert(result.data?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full md:w-[30%] bg-white p-8 rounded-xl flex flex-col items-center"
      >
        <img src="Product_Logo.png" alt="Logo" className="max-w-40 " />

        <h1 className="mb-4 font-bold text-xl text-gray-900">PRODUCT MANAGEMENT</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-4 rounded-xl border border-gray-300"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-4 rounded-xl border border-gray-300"
          value={userDetails.password}
          onChange={(e) =>
            setUserDetails({ ...userDetails, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-3xl text-white bg-gray-500 hover:bg-gray-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
