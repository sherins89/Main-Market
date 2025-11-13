import db from "#db/client";

// Create new order for user //
export async function createOrder(date, note, userID) {
  const {
    rows: [order],
  } = await db.query(
    `
      INSERT INTO orders (date, note, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [date, note, userId]
  );
}
