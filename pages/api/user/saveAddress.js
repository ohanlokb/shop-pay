import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

//import nc from "next-connect";
//const handler = nc().use(auth);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth);;

router.post(async (req, res) => {
  try {
    await db.connect();
    const { address } = req.body;

    let user = await User.findById(req.user);
    await user.updateOne({
      $push: {
        address: address,
      },
    });

    await db.disconnect();

    return res.status(200).json({ addresses: user.address });
  } catch (error) {
    console.log('Error',error);
    return res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
}

export default router.handler();
