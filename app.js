import express from "express";
import getUserFromToken from "./middleware/getUserFromToken.js";
import usersRouter from "./router/users.js";
import productsRouter from "./router/products.js";
import ordersRouter from "./router/orders.js";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

// error handler at last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

export default app;
