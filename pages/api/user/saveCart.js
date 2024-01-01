import Product from "../../../models/Product";
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
//const handler = nc().use(auth);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth);;

router.post(async (req, res) => {
  try {
    await db.connect();
    const { cart } = req.body;
    
    let products = [];
    let user = await User.findById(req.user);
    let existing_cart = await Cart.findOne({ user: user._id });

    if (existing_cart) {
      //await existing_cart.remove();
      await Cart.findByIdAndDelete(existing_cart._id);
    }

    for (let i = 0; i < cart.length; i++) {
      let dbProduct = await Product.findById(cart[i]._id).lean();
      let subProduct = dbProduct.subProducts[cart[i].style];
      let tempProduct = {};
      tempProduct.name = dbProduct.name;
      tempProduct.product = dbProduct._id;
      tempProduct.color = {
        color: cart[i].color.color,
        image: cart[i].color.image,
      };
      tempProduct.image = subProduct.images[0].url;
      tempProduct.qty = Number(cart[i].qty);
      tempProduct.size = cart[i].size;
      let price = Number(
        subProduct.sizes.find((p) => p.size == cart[i].size).price
      );
      tempProduct.price =
        subProduct.discount > 0
          ? (price - price / Number(subProduct.discount)).toFixed(2)
          : price.toFixed(2);

      products.push(tempProduct);
    }
    
    let cartTotal = 0;

    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].qty;
    }
    
    await new Cart({
      products,
      cartTotal: cartTotal.toFixed(2),
      user: user._id,
    }).save();
    
    db.disconnect();

    return res.status(200).json({ message: 'Cart saved.' });
    
  } catch (error) {
    console.log('Gathering Data Error:', error);
    return res.status(500).json({ message: error.message });
  }  
});

export const config = {
  api: {
    externalResolver: true,
  },
}

export default router.handler();
