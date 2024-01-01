import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    checkoutItems : []
};

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialState,
    reducers: {
        addToCart(state, action) {
            state.checkoutItems.push(action.payload);
        },
        
        updateCart(state, action) {
            state.checkoutItems = action.payload;
        },

        emptyCart(state, action) {
            state.checkoutItems = [];
        }        
    }
});

export const {addToCart, updateCart, emptyCart} = checkoutSlice.actions;

export default checkoutSlice.reducer;