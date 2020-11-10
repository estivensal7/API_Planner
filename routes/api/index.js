// Dependencies
const router = require("express").Router();
const authRoutes = require("./auth");
const projectRoutes = require("./projects");
const userRoutes = require("./users");

// Item routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

//Exporting
module.exports = router;
