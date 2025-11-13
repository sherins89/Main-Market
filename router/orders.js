//All remaining test for orders - POST GET from home work//
// Middlewares to be used requireuser and requirebody //

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

//Post order middleware // New order for user with date //
router.post("/", requireUser, requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;

    const order = await createOrder(date, note ?? null, req.user.id);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// filter to check existing order //
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

// GET // Order : id // with error message 404 and 403 //
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const { order } = await loadOrderAndCheckUser(req, res);
    if (!order) return; // 404 or 403 already sent

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /orders/:id/products with all errors asked //

// TO DO // REMINDER //
