import { success } from 'zod';
import productModel from '../models/product.model.js';
import { uploadFile } from '../services/storage.service.js';
import { param } from 'express-validator';

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  const images = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
      return { url: result.url };
    })
  );

  const product = await productModel.create({
    title: title,
    description: description,

    price: {
      amount: priceAmount,
      currency: priceCurrency || 'INR',
    },
    images,
    seller: seller.id,
  });

  res.status(201).json({
    message: 'Product created successfully',
    success: true,
    product,
  });
}

export async function getSellerProducts(req, res) {
  const products = await productModel.find({ seller: req.user._id });
  res.status(200).json({
    message: 'Products fetched successfully',
    success: true,
    products,
  });
}

export async function productDetails(req, res) {
  const id = req.params.id;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
      success: false,
    });
  }

  res.status(200).json({
    message: 'Product details fetched',
    product,
  });
}
