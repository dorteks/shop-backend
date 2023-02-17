import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  next();
});

const userRoutes = require("./src/routes/userRoutes");
const shopRoutes = require("./src/routes/shopRoutes");

app.use(userRoutes, shopRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
