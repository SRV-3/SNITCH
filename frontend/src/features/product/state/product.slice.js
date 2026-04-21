import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProduct:[],
        products:[],
        searchProducts:[]
    },
    reducers:{
        setSellerProduct:(state,action)=>{
            state.sellerProduct = action.payload
        },
        setProducts:(state,action)=>{
            state.products = action.payload
        },
        setSearchProducts:(state,action)=>{
            state.searchProducts = action.payload
        }
    }
})

export const {setSellerProduct,setProducts,setSearchProducts} = productSlice.actions

export default productSlice.reducer