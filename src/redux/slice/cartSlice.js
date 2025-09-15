import { createSlice } from "@reduxjs/toolkit";

// ✅ Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ✅ Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
};

export const cartSlice = createSlice({

  name: "cartSlice",
  initialState: loadCartFromStorage(),

  reducers: {
    // Add a new item to cart
    
    addToCart: (state, action) => {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        alert("Item already in cart 😃");
      } else {
        state.push({ ...action.payload, quantity: action.payload.quantity || 1 });
        saveCartToStorage(state);
      }
      
    },

    // addToCart: (state, action) => {
    //   if (state.find((item) => item.id == action.payload.id)) {
    //     alert('Item already present  😃')
    //   }
    //   else {
    //     state.push(action.payload)
    //   }
    // },

    // Remove item by id
    removeCartItem: (state, action) => {
      const updated = state.filter((item) => item.id !== action.payload);
      saveCartToStorage(updated);
      return updated;
    },

    // Empty entire cart
    emptyCart: () => {
      saveCartToStorage([]);
      return [];
    },

    // Replace cart (used for restoring from storage)
    setCart: (state, action) => {
      saveCartToStorage(action.payload);
      return action.payload;
    },

    // Update quantity of a specific cart item
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
        saveCartToStorage(state);
      }
    },
  },
});

export const { addToCart, removeCartItem, emptyCart, setCart, updateCartQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
