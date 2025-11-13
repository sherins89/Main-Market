import db from "#db/client";

// GET all products //
export async function getAllProducts() {
  const { rows } = await db.query(`
    SELECT *
    FROM products
    ORDER BY id;
  `);
  return rows;
}

// GET one product by id //
export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query(
    `
      SELECT *
      FROM products
      WHERE id = $1;
    `,
    [id]
  );

  return product ?? null;
}

// GET all orders for a given product and user //
export async function getOrdersByProductAndUser(productId, userId) {
  const { rows } = await db.query(
    `
      SELECT o.*
      FROM orders o
      JOIN orders_products op
        ON op.order_id = o.id
      WHERE op.product_id = $1
        AND o.user_id = $2
      ORDER BY o.id;
    `,
    [productId, userId]
  );

  return rows;
}
