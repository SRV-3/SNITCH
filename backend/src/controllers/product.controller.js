import productModel from '../models/product.model.js';
import { uploadFile } from '../services/storage.service.js';
import { param } from 'express-validator';

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  console.log(priceAmount);

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
      price: {
        amount: priceAmount,
        currency: priceCurrency || 'INR',
      },
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

export async function getAllProducts(req, res) {
  const products = await productModel.find();
  res.status(200).json({
    message: 'Product fetched successfully',
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

export async function addVariants(req, res) {
  const productId = req.params.id;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user.id,
  });

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
      success: false,
    });
  }

  const files = req.files;
  const images = [];

  if (files || files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        })
      )
    ).map((image) => images.push(image));
  }

  const amount = req.body.amount;
  const currency = req.body.currency;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes);

  console.log(amount); //1299
  console.log(product.price.amount);

  product.variants.push({
    images,
    price: {
      price: {
        amount: amount || product.price.price.amount,
        currency: currency || product.price.price.currency,
      },
    },
    stock,
    attributes,
  });

  await product.save();
  return res.status(200).json({
    message: 'Product variant added successfully',
    success: true,
    product,
  });
}

export async function updateProduct(req, res) {
  const productId = req.params.id;

  const files = req.files;

  let images;

  if (files && files.length > 0) {
    images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: result.url };
      })
    );
  }
  const { title, description, priceAmount, priceCurrency } = req.body;
  const update = {};

  if (title) update.title = title;
  if (description) update.description = description;
  if (priceAmount) update['price.amount'] = priceAmount;
  if (priceCurrency) update['price.currency'] = priceCurrency;
  if (images) {
    update.images = images;
  }

  const product = await productModel.findOneAndUpdate({ _id: productId, seller: req.user.id }, { $set: update }, { new: true });

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
      success: false,
    });
  }

  res.status(200).json({
    message: 'Product Updated successfully',
    success: true,
    product,
  });
}

export async function searchProduct(req, res) {
  const query = req.query.q;
  const stopWords = ['the', 'a', 'for', 'in', 'which', 'one'];
  const tokens = query.toLowerCase().trim().split(/\W+/);
  const filteredTokens = tokens.filter((word) => !stopWords.includes(word));

  const products = await productModel.find({
    $and: [
      {
        $or: filteredTokens.flatMap((token) => [
          { title: { $regex: token, $options: 'i' } },
          { description: { $regex: token, $options: 'i' } },
          { category: { $regex: token, $options: 'i' } },
        ]),
      },
      {
        'variants.stock': { $gt: 0 },
      },
    ],
  });

  res.status(200).json({ products });
}
