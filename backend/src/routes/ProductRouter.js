const express = require("express");
const router = express.Router()
const ProductController = require("../controllers/ProductController");
const { authMiddlewear } = require("../middleware/authMiddlewear");

router.post('/create', ProductController.createProduct);
router.put('/update/:id', authMiddlewear, ProductController.updateProduct);
router.get('/details/:id', ProductController.getDetailsProduct);
router.delete('/delete/:id', authMiddlewear, ProductController.deleteProduct);
router.post('/delete-many', authMiddlewear, ProductController.deleteMany);
router.get('/all', ProductController.getAllProduct);
router.get('/get-all-type', ProductController.getAllType);

module.exports = router;