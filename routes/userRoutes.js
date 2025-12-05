const express = require("express");
const { getAllUsers, 
        getUserById, 
        registerUser, 
        loginUser 
      } = require("../controllers/userController");
const {authMiddleware, adminOnly} =require ( '../middlewares/auth');
// Router
const userRouter = express.Router();

/**
 * GET /api/user/
 */
// userRouter.get("/", getAllUsers);

// userRouter.get("/",authMiddleware ,adminOnly,getAllUsers);
userRouter.get("/",authMiddleware ,getAllUsers);

/**
 * GET /api/user/:id
 */
userRouter.get("/:id", getUserById);

/**
 * POST /api/user/register
 */
userRouter.post('/register', registerUser)


/**
 * POST /api/user/login
*/
userRouter.post('/login',loginUser);


module.exports = userRouter;
