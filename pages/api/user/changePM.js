//import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
//const handler = nc().use(auth);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth);;

router.put(async (req, res) => {
  try {
    await db.connect();
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user);
    await user.updateOne(
      {
        defaultPaymentMethod: paymentMethod,
      },
      { returnOriginal: false }
    );
    await db.disconnect();
    return res.json({ paymentMethod: user.defaultPaymentMethod });
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
