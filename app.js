import express from "express";
import getUserFromToken from "./middleware/getUserFromToken.js";
import usersRouter from "./router/users.js";
import productsRouter from "./router/products.js";

const app = express();

app.use(express.json()); // should be on top before the router middleware //

app.use(getUserFromToken);
app.use("/products", productsRouter);

app.use("/users", usersRouter);
//error handler at last for router //
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

// At last //

export default app;
