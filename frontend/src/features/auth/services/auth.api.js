import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

export const registerUser = async ({email,contact,password,fullname,isSeller}) => {
    try {
        const response = await authApiInstance.post("/register", {email,contact,password,fullname,isSeller});
        return response.data;
    } catch (error) {
        throw error;
    }
}
    
export async function login({ email, password }) {
    const response = await authApiInstance.post("/login", {
        email, password
    })

    return response.data
}