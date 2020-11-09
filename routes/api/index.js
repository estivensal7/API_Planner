// Dependencies
const router = require("express").Router();
const authRoutes = require("./auth");
const projectRoutes = require("./projects");
const userRoutes = require("./users");

// Item routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/project", projectRoutes);

//Exporting
module.exports = router;
