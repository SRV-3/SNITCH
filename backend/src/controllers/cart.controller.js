import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';
import { getStock } from '../dao/product.dao.js';

export async function addToCart(req, res) {
  const { productId, variantId } = req.params;
  const { quantity } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    'variants._id': variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: 'Product or variant not found',
      success: false,
    });
  }

  const stock = await getStock(productId, variantId);
  const cart = (await cartModel.findOne({ user: req.user.id })) || (await cartModel.create({ user: req.user.id }));

  const isProductAlreadyInCart = cart.items.some((item) => item.product.toString() === productId && item.variant.toString() === variantId);
  console.log(isProductAlreadyInCart); //flase

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) => item.product.toString() === productId && item.variant.toString() === variantId
    ).quantity;

    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user.id,
        'items.product': productId,
        'items.variant': variantId,
      },
      {
        $inc: { 'items.$.quantity': quantity },
      },
      {
        returnDocument: 'after',
      }
    );
  } else if (!isProductAlreadyInCart) {
    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price: { price: { amount: product.price.price.amount } },
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  await cart.save();

  return res.status(200).json({
    message: 'Product added to cart successfully',
    success: true,
  });
}
export async function getCart(req, res) {
  const cart = await cartModel.find({ user: req.user.id });

  if (!cart) {
    return res.status(400).json({
      message: `No cart available for you`,
      success: false,
    });
  }

  const productIds = cart[0].items.map((item) => item.product);
  const variantIds = cart[0].items.map((item) => item.variant);

  const products = await productModel.find({
    _id: { $in: productIds },
  });

  if (!products) {
    return res.status(400).json({
      message: `Products are not available`,
      success: false,
    });
  }

  const items = [];
  const cartItems = cart[0].items.map((item) => {
    const product = products.find((p) => p._id.equals(item.product));
    const variant = product.variants.find((v) => v._id.equals(item.variant));

    const data = {
      productId: item.product,
      variantId: item.variant,
      title: product.title,
      attributes: variant.attributes,
      image: product.images[0].url,
      quantity: item.quantity,
      price: variant.price.price.amount,
      currency: variant.price.price.currency,
    };
    return items.push(data);
  });

  const product = await productModel.findOne();

  res.status(200).json({
    message: `cart fetched`,
    success: success,
    items,
  });
}
