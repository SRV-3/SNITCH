import {setItems,addItem} from "../state/cart.slice";
import { addToCart } from "../services/cart.api";
import { useDispatch } from "react-redux";

export function useCart(){
    const dispatch = useDispatch();

    async function handleAddToCart ({productId,variantId}) {
        const data = await addToCart({productId,variantId});
        return data;
    }

    return {
        handleAddToCart
    }
}