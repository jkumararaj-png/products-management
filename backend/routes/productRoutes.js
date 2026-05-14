const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

router.get("/", verifyToken, getAllProducts);

router.get("/:id", verifyToken, getProductById);

module.exports = router;
