import express from "express";
import getUserFromToken from "./middleware/getUserFromToken.js";

const app = express();

app.use(express.json());

// if a token is sent, put the user on req.user
app.use(getUserFromToken);

export default app;
