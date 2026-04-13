import {setUser, setLoading, setError} from "../auth.slice.js"
import {useDispatch} from "react-redux"
import {registerUser, login} from "../services/auth.api.js"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({email,contact,password,fullname,isSeller}) {
        const data = await registerUser({email,contact,password,fullname,isSeller})
        dispatch(setUser(data))
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
    }

    return { handleRegister, handleLogin }
        
}

