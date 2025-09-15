import { configureStore } from "@reduxjs/toolkit";

import  cartSlice  from "./slice/cartSlice";


const store = configureStore({
    reducer:{
        cartReducer : cartSlice
    }
})

export default store 