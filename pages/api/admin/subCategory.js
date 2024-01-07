//import nc from "next-connect";
import auth from "../../../middleware/auth";
import admin from "../../../middleware/admin";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import db from "../../../utils/db";
import slugify from "slugify";
//const handler = nc().use(auth).use(admin);

import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.post(async (req, res) => {
  try {
    const { name, parent } = req.body;
    db.connect();
    const test = await SubCategory.findOne({ name });
    if (test) {
      return res
        .status(400)
        .json({ message: "SubCategory already exist, Try a different name" });
    }
    await new SubCategory({ name, parent, slug: slugify(name) }).save();

    db.disconnect();
    res.json({
      message: `SubCategory ${name} has been created successfully.`,
      subCategories: await SubCategory.find({}).sort({ updatedAt: -1 }),
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
    await SubCategory.findByIdAndRemove(id);
    db.disconnect();
    return res.json({
      message: "SubCategory has been deleted successfuly",
      subCategories: await SubCategory.find({}).sort({ updatedAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(async (req, res) => {
  try {
    const { id, name, parent } = req.body;
    db.connect();
    await SubCategory.findByIdAndUpdate(id, {
      name,
      parent,
      slug: slugify(name),
    });
    db.disconnect();
    return res.json({
      message: "SubCategory has been updated successfuly",
      subCategories: await SubCategory.find({}).sort({ createdAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category);
    if (!category) {
      return res.json([]);
    }
    db.connect();
    const results = await SubCategory.find({ parent: category }).select("name");
    console.log(results);
    db.disconnect();
    return res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
