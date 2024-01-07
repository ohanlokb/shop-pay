//import nc from "next-connect";
import auth from "../../../middleware/auth";
import admin from "../../../middleware/admin";
import Category from "../../../models/Category";
import db from "../../../utils/db";
import slugify from "slugify";
//const handler = nc().use(auth).use(admin);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.post(async (req, res) => {
  try {
    const { name } = req.body;
    db.connect();
    const test = await Category.findOne({ name });
    if (test) {
      return res
        .status(400)
        .json({ message: "Category already exist, Try a different name" });
    }
    await new Category({ name, slug: slugify(name) }).save();

    db.disconnect();
    res.json({
      message: `Category ${name} has been created successfully.`,
      categories: await Category.find({}).sort({ updatedAt: -1 }),
    });
  } catch (error) {
    db.disconnect();
    res.status(500).json({ message: error.message });
  }
});

router.delete(async (req, res) => {
  try {
    const { id } = req.body;
    db.connect();
    await Category.findByIdAndRemove(id);
    db.disconnect();
    return res.json({
      message: "Category has been deleted successfuly",
      categories: await Category.find({}).sort({ updatedAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(async (req, res) => {
  try {
    const { id, name } = req.body;
    db.connect();
    await Category.findByIdAndUpdate(id, { name });
    db.disconnect();
    return res.json({
      message: "Category has been updated successfuly",
      categories: await Category.find({}).sort({ createdAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
