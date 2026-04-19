import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProduct:[],
        products:[]
    },
    reducers:{
        setSellerProduct:(state,action)=>{
            state.sellerProduct = action.payload
        },
        setProducts:(state,action)=>{
            state.products = action.payload
        }
    }
})

export const {setSellerProduct,setProducts} = productSlice.actions

export default productSlice.reducer