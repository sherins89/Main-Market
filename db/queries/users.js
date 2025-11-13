import db from "#db/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// New user with hashed password //
export async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username;
    `,
    [username, passwordHash]
  );

  return user;
}

// find user by username //
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(
    `
      SELECT *
      FROM users
      WHERE username = $1;
    `,
    [username]
  );

  return user ?? null;
}

// find user by id //
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    `
      SELECT id, username
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

  return user ?? null;
}

// check username and password and return user if correct //
export async function verifyUserCredentials(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  // only return safe fields //
  return { id: user.id, username: user.username };
}
