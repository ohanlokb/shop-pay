//import nc from "next-connect";
import User from "../../../models/User";
import Coupon from "../../../models/Coupon";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
//const handler = nc().use(auth);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth);;

router.post(async (req, res) => {
  try {
    await db.connect();
    const { coupon } = req.body;
    const user = User.findById(req.user);
    const checkCoupon = await Coupon.findOne({ coupon });
    if (checkCoupon == null) {
      return res.json({ message: "Invalid coupon" });
    }
    const { cartTotal } = await Cart.findOne({ user: req.user });
    let totalAfterDiscount =
      cartTotal - (cartTotal * checkCoupon.discount) / 100;

    await Cart.findOneAndUpdate({ user: user._id }, { totalAfterDiscount });

    res.json({
      totalAfterDiscount: totalAfterDiscount.toFixed(2),
      discount: checkCoupon.discount,
    });

    await db.disconnect();
    return res.json({ addresses: user.address });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
}

export default router.handler();
