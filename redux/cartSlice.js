import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    total: 0,
    cartQty: 0,
  },
  reducers: {
    addProducts: (state, action) => {
      const { productsNew, qtyToAdd } = addCartItem(
        [...state.products],
        action.payload
      );
      state.products = productsNew;
      state.cartQty += Number(action.payload.qty);
      state.total += Number(action.payload.price) * Number(action.payload.qty);
    },
    emptyCart: (state) => {
      state.products = [];
      state.cartQty = 0;
      state.total = 0;
    },
    removeProduct: (state, action) => {
      const { payload: product } = action;
      const productsLeft = state.products.filter((p) => p._id !== product._id);
      state.products = productsLeft;
      state.cartQty -= Number(product.qty);
      state.total -= product.price * product.qty;
    },
  },
});

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === productToAdd._id
  );

  if (existingCartItem) {
    return {
      productsNew: cartItems.map((cartItem) =>
        cartItem._id === productToAdd._id
          ? {
              ...cartItem,
              qty: Number(cartItem.qty) + Number(productToAdd.qty),
            }
          : cartItem
      ),
      qtyToAdd: 0,
    };
  }

  return {
    productsNew: [
      ...cartItems,
      { ...productToAdd, qty: Number(productToAdd.qty) },
    ],
    qtyToAdd: 1,
  };
};

export const { addProducts, emptyCart, removeProduct } =
  cartSlice.actions;
export default cartSlice.reducer;
