const express = require("express");
const router = express.Router()
const userController = require("../controllers/UserController");
const { authMiddlewear, authUserMiddlewear } = require("../middleware/authMiddlewear");

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id', authUserMiddlewear, userController.updateUser)
router.delete('/delete-user/:id', authMiddlewear, userController.deleteUser)
router.get('/getAll', authMiddlewear, userController.getAllUser)
router.get('/get-details/:id', authUserMiddlewear, userController.getDetailsUser)
router.post('/refresh-token', userController.refreshToken)

module.exports = router;