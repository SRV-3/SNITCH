import React,{ useEffect }  from 'react'
import {useCart} from '../hooks/useCart'
import { useSelector } from 'react-redux';

function Cart() {
    const {handleGetCart} = useCart();
    const cart = useSelector((state) => state.cart.items);
    useEffect(() => {
        handleGetCart();
    }, []);
  return (
    <div>cart</div>
  )
}

export default Cart