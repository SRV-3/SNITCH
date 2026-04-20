import { createBrowserRouter,Outlet } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/product/pages/CreateProduct";
import Dashboard from "../features/product/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import SellerProductDetails from "../features/product/pages/SellerProductDetails";
import ProductDetails from "../features/product/pages/ProductDetails";
import Home from "../features/product/pages/Home";
import EditProduct from "../features/product/pages/EditProduct";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
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
        path: "/product/:id",
        element: <ProductDetails />
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
            },
            {
                path:"product/:id",
                element: <Protected role="seller"><SellerProductDetails /></Protected>
            },
            {
                path:"product/:id/edit",
                element: <Protected role="seller"><EditProduct /></Protected>
            }
        ]
    }
])

export default router