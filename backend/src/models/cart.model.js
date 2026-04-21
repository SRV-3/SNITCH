import mongoose from 'mongoose';
import { required } from 'zod/mini';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: product,
        required: true,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: product.varians,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: priceSchema,
        required: true,
      },
    },
  ],
});

const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;
