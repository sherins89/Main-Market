import express from "express";
import {
  getAllProducts,
  getProductById,
  getOrdersByProductAndUser,
} from "#db/queries/products";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();

// GET /products //
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products); // array of all products
  } catch (err) {
    next(err);
  }
});

// GET /products/:id //
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.json(product); // specific product
  } catch (err) {
    next(err);
  }
});

// GET /products/:id/orders //
router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // first, check if the product exists
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // GET orders for this product made by the logged-in user //
    const orders = await getOrdersByProductAndUser(id, req.user.id);

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
