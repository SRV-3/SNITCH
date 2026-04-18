import {setSellerProduct} from "../state/product.slice.js"
import { useDispatch } from "react-redux"
import { createProduct, getSellerProducts } from "../services/product.api.js"

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

    return { handleCreateProduct, handleGetSellerProducts }
}