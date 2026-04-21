import productModel from '../models/product.model.js';

export async function getStock(productId, variantId) {
  const product = await productModel.findOne({
    _id: productId,
    'variants._id': variantId,
  });

  const stock = product.variants.find((variant) => variant._id.toString() === variantId).stock;
  return stock;
}
