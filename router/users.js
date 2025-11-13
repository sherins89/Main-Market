import express from "express";
import requireBody from "../middleware/requireBody.js";
import { createUser, verifyUserCredentials } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";

const router = express.Router();

// POST /users/register //
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // create user // password is hashed //
      const user = await createUser(username, password);

      // create a token //
      const token = createToken({
        id: user.id,
        username: user.username,
      });

      res.status(201).json({ token });
    } catch (err) {
      // 23505 = unique violation (username already used)
      if (err.code === "23505") {
        return res.status(400).json({ error: "Username already taken" });
      }

      next(err);
    }
  }
);

// POST /users/login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await verifyUserCredentials(username, password);

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = createToken({
        id: user.id,
        username: user.username,
      });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
