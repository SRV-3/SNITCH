import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/product",
    withCredentials: true,
})

export const createProduct = async (formData) => {
    const response = await productApiInstance.post("/",formData);
    return response.data;
};

export const getSellerProducts = async () => {
    const response = await productApiInstance.get("/seller-products");
    return response.data;
};

export const getProductById = async (id) => {
    const response = await productApiInstance.get(`/${id}`);
    return response.data;
};