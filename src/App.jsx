import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './Pages/Auth';
import AdminHome from './Admin/AdminHome';
import Cart from './User/Cart';
import Main from './User/Main';
import Product from './Product';
import AdminProduct from './Admin/AdminProduct';
import AdminDashboard from './Admin/AdminDashboard';
import AdminOrder from './Admin/AdminOrder';
import ProtectedRoute from './Auth/ProtectedRoute';
import UnReal from './Auth/UnReal';
import { useEffect, useState } from 'react';
import UserOrder from './User/UserOrder';

function App() {

  const [token ,settoken ] = useState("")
   useEffect(() => {
  
      if (localStorage.getItem("token")) {
  
        const token = localStorage.getItem("token")
        settoken(token)
  
      }
  
    }, [])

  return (

    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/unreal" element={<UnReal />} />

      <Route
        path="/admin-home"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <>
              <Cart />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <>
              <Product />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/main"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <>
              <Main />
            </>
          </ProtectedRoute>
        }
      />

       <Route
        path="/userOrder"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <>
              <UserOrder/>
            </>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
