import { createBrowserRouter,Outlet } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/product/pages/CreateProduct";
import Dashboard from "../features/product/pages/Dashboard";
import Protected from "../features/auth/components/Protected";

const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Welcome to snitch</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/seller",
        element:<Outlet />,
        children:[
            {
                path:"create-product",
                element: <Protected role="seller"><CreateProduct /></Protected>
            },
            {
                path:"dashboard",
                element: <Protected role="seller"><Dashboard /></Protected>
            }
        ]
    }
])

export default router