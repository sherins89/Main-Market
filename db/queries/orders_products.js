import db from "#db/client";

// add a product to an order //
export async function addProductToOrder(orderId, productId, quantity) {
  const {
    rows: [orderProduct],
  } = await db.query(
    `
      INSERT INTO orders_products (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (order_id, product_id) DO UPDATE
        SET quantity = orders_products.quantity + EXCLUDED.quantity
      RETURNING *;
    `,
    [orderId, productId, quantity]
  );

  return orderProduct;
}

// GET all products in an order //
export async function getProductsInOrder(orderId) {
  const { rows } = await db.query(
    `
      SELECT
        p.*,
        op.quantity
      FROM orders_products op
      JOIN products p
        ON p.id = op.product_id
      WHERE op.order_id = $1
      ORDER BY p.id;
    `,
    [orderId]
  );

  return rows;
}
