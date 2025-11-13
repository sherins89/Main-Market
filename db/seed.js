import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  console.log("Seeding...");

  /// truncate old data //
  await db.query("DELETE FROM orders_products;");
  await db.query("DELETE FROM orders;");
  await db.query("DELETE FROM products;");
  await db.query("DELETE FROM users;");

  // one user //
  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
    `,
    ["Jo Darko", "password123"]
  );

  // 10 products //
  const products = [];

  for (let i = 1; i <= 10; i++) {
    const {
      rows: [product],
    } = await db.query(
      `
        INSERT INTO products (title, description, price)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [`Product ${i}`, `Description for product ${i}`, i * 10]
    );
    products.push(product);
  }

  // one user //
  const {
    rows: [order],
  } = await db.query(
    `
      INSERT INTO orders (date, note, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    ["2025-02-02", "First order with 5 items", user.id]
  );

  // 5 products //
  for (let i = 0; i < 5; i++) {
    await db.query(
      `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3);
      `,
      [order.id, products[i].id, 1]
    );
  }

  console.log("Done.");
}
