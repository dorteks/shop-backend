import { Router } from "express";
const shopController = require("../controllers/shopController");

const router = Router();

router.get("/shops", shopController.getShops);

module.exports = router;
