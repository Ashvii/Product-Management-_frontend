import { commonApi } from "./commonApi"

const serverUrl = import.meta.env.VITE_SERVER_URL

// login 
export const loginApi = async (reqBody) => {
  return await commonApi('POST', `${serverUrl}/api/login`, reqBody)
}

export const productApi = async (reqBody, reqHeader = {}) => {
  return await commonApi("POST", "/api/product", reqBody, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...reqHeader,
  });
};

export const deleteProductApi = async (productId, reqHeader = {}) => {
  return await commonApi("DELETE", `/api/product/${productId}`, null, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...reqHeader,
  });
};

export const updateProductApi = async (id, reqBody, reqHeader) => {
  return await commonApi("POST", `/api/product/${id}`, reqBody, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...reqHeader,
  });
};

export const getProducts = async () => {
  return await commonApi("GET", "/api/products");
};

export const cartProductApi = async (reqBody, reqHeader = {}) => {
  return await commonApi("POST", "/api/cart", reqBody, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...reqHeader,
  });
};

export const updatequantityApi = async (productId, reqBody, reqHeader = {}) => {
  const token = localStorage.getItem("token");

  return await commonApi("POST", `/api/products/${productId}/quantity`, reqBody, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...reqHeader,
  });
};

export const getQuantityLogsApi = async (productId, reqHeader = {}) => {
  return await commonApi("GET", `/api/products/${productId}/quantity-logs`, null, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...reqHeader,
  });
};

export const checkoutApi = async (payload) => {
  const token = localStorage.getItem("token");
  return await commonApi("POST", "/api/checkout", payload, {
    Authorization: `Bearer ${token}`,
  });
};

export const OrderApi = async () => {
  const token = localStorage.getItem("token");
  return await commonApi("GET", "/api/orders", null, {
    Authorization: `Bearer ${token}`,
  });
};

export const ApproveOrderApi = (orderId, token) =>
  commonApi("POST", `/api/orders/${orderId}/approve`, {}, {
    Authorization: `Bearer ${token}`,
  });

export const CancelOrderApi = (orderId, token) =>
  commonApi("POST", `/api/orders/${orderId}/cancel`, {}, {
    Authorization: `Bearer ${token}`,
  });

export const ApprovedOrdersApi = (token) =>
  commonApi("GET", `/api/approved-orders`, {}, {
    Authorization: `Bearer ${token}`,
  });

/* 🎁 Reward APIs */

// Get reward points of a user
export const getRewardPointsApi = async (userId, reqHeader = {}) => {
  const token = localStorage.getItem("token");
  return await commonApi("GET", `/api/reward-points/${userId}`, null, {
    Authorization: `Bearer ${token}`,
    ...reqHeader,
  });
};


// Redeem reward points
export const redeemPointsApi = async (userId, pointsToRedeem, reqHeader = {}) => {
  const token = localStorage.getItem("token");
  return await commonApi("POST", `/api/reward-points/redeem`, {
    user_id: userId,
    points: pointsToRedeem,
  }, {
    Authorization: `Bearer ${token}`,
    ...reqHeader,
  });
};
