import React from 'react'
import { useProduct } from '../hooks/useProduct'

function CreateProduct() {
    const {handleCreateProduct} = useProduct()

    const handleSubmit = (e) => {
        e.preventDefault()
        handleCreateProduct(e.target)
    }
  return (
    <div>CreateProduct</div>
  )
}

export default CreateProduct