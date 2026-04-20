import {setSellerProduct,setProducts} from "../state/product.slice.js"
import { useDispatch } from "react-redux"
import { createProduct, getSellerProducts, getProductById,getAllProducts, addVariants } from "../services/product.api.js"

export const useProduct = () => {
    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.products
    }

    async function handleGetSellerProducts(){
        const data = await getSellerProducts()
        dispatch(setSellerProduct(data.products))
        return data.products
    }

    async function handleGetAllProducts(){
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        return data.products
    }

    async function handleGetProductById(id){
        const data = await getProductById(id)
        return data.product
    }

    async function handleAddVariants(productId, variants){
        const data = await addVariants(productId, variants)
        return data.variants
    }

    return { handleCreateProduct, handleGetSellerProducts, handleGetProductById, handleGetAllProducts, handleAddVariants }
}