import express from "express";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";
import { getProductById } from "#db/queries/products";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from "#db/queries/orders";
import {
  addProductToOrder,
  getProductsInOrder,
} from "#db/queries/orders_products";

const router = express.Router();

/**
 * 🔒 POST /orders
 * - body must include date
 * - creates a new order for the logged-in user
 */
router.post("/", requireUser, requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;

    const order = await createOrder(date, note ?? null, req.user.id);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * 🔒 GET /orders
 * - sends array of all orders made by logged-in user
 */
router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * helper: check order existence and ownership
 */
async function loadOrderAndCheckUser(req, res) {
  const id = Number(req.params.id);

  const order = await getOrderById(id);
  if (!order) {
    res.status(404).send("Order not found");
    return { order: null };
  }

  if (order.user_id !== req.user.id) {
    res.status(403).send("Forbidden");
    return { order: null };
  }

  return { order };
}

/**
 * 🔒 GET /orders/:id
 * - 404 if order does not exist
 * - 403 if logged-in user is not owner
 * - sends the order
 */
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const { order } = await loadOrderAndCheckUser(req, res);
    if (!order) return; // 404 or 403 already sent

    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * 🔒 POST /orders/:id/products
 * - 404 if order does not exist
 * - 403 if not owner
 * - 400 if body missing productId or quantity
 * - 400 if product does not exist
 * - adds product to order and returns orders_products record
 */
router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const { order } = await loadOrderAndCheckUser(req, res);
      if (!order) return;

      const { productId, quantity } = req.body;

      // check product exists
      const product = await getProductById(productId);
      if (!product) {
        return res.status(400).send("Product does not exist");
      }

      const orderProduct = await addProductToOrder(
        order.id,
        product.id,
        quantity
      );

      res.status(201).json(orderProduct);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 🔒 GET /orders/:id/products
 * - 404 if order does not exist
 * - 403 if not owner
 * - sends array of products in this order
 */
router.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const { order } = await loadOrderAndCheckUser(req, res);
    if (!order) return;

    const products = await getProductsInOrder(order.id);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

export default router;
