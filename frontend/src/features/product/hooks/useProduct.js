import {setSellerProduct} from "../states/product.slice.js"
import { useDispatch } from "react-redux"
import { createProduct } from "../services/product.api.js"

export const useProduct = () => {
    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        dispatch(setSellerProduct(data))
    }

    return { handleCreateProduct }
}