//import nc from "next-connect";
import auth from "../../../../middleware/auth";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

//const handler = nc().use(auth);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth);

router.put(async (req, res) => {
  await db.connect();
  
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const newOrder = await order.save();
    await db.disconnect();
    res.json({ message: "Order is paid.", order: newOrder });
  } else {
    await db.disconnect();
    res.status(404).json({ message: "Order is not found." });
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
}

export default router.handler();
