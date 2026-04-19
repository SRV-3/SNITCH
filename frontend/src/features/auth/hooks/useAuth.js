import {setUser, setLoading, setError} from "../state/auth.slice.js"
import {useDispatch} from "react-redux"
import {registerUser, login,getMe} from "../services/auth.api.js"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({email,contact,password,fullname,isSeller}) {
        const data = await registerUser({email,contact,password,fullname,isSeller})
        dispatch(setUser(data))
        return data.user
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleGetMe(){
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
        
}

