// Vite-safe import
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get role from user object
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Check if user is logged in
export const isLoggedIn = () => !!getUser();
