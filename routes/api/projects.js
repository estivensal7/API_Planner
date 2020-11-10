const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Project = require("../../models/Project");

// @route    GET api/projects/me
// @desc     Get current user's projects
// @access   Private
// WORKS
router.get("/me", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    }).populate("user", ["name"]);

    if (!projects) {
      return res.status(400).json({ msg: "This user has no projects." });
    }

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/projects
// @desc     Create a project
// @access   Private
// WORKS
router.post(
  "/",
  auth,
  check("title", "Title is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      title,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // build a project
    const projectFields = new Project({
      user: req.user.id,
      title: req.body.title,
      ...rest,
    });

    try {
      // Using upsert option (creates new doc if no match is found):
      let project = await projectFields.save();
      return res.json(project);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/projects/:project_id
// @desc     Get project by ID
// @access   Private
// WORKS
router.get("/:project_id", async ({ params: { project_id } }, res) => {
  try {
    const project = await Project.findOne({
      _id: project_id,
    });

    if (!project) return res.status(400).json({ msg: "Project not found" });

    return res.json(project);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    DELETE api/projects/:project_id
// @desc     Delete project
// @access   Private
// WORKS
router.delete("/:project_id", auth, async (req, res) => {
  try {
    // Remove project
    await Project.findOneAndRemove({ _id: req.params.project_id });

    res.json({ msg: "Project deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/projects/models/:project_id
// @desc     Add models to project
// @access   Private
router.post(
  "/models/:project_id",
  [auth, [check("name", "Model's Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const { propName, propType, requiredProp } = req.body.properties[0];

    const newModel = {
      name,
      description,
      properties: [
        {
          propName,
          propType,
          requiredProp,
        },
      ],
    };

    try {
      const project = await Project.findOne({ _id: req.params.project_id });

      project.models.unshift(newModel);

      await project.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/projects/models/:project_id/:model_id
// @desc     Delete model from project
// @access   Private
router.delete("/models/:project_id/:model_id", auth, async (req, res) => {
  try {
    const foundProject = await Project.findOne({ _id: req.params.project_id });
    foundProject.models = foundProject.models.filter(
      (model) => model._id.toString() !== req.params.model_id
    );
    await foundProject.save();
    return res.status(200).json(foundProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    POST api/projects/routes/:project_id
// @desc     Add routes to project
// @access   Private
router.post(
  "/routes/:project_id",
  [auth, [check("name", "Route's Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, operation, path } = req.body;

    const newRoute = {
      name,
      description,
      operation,
      path,
    };

    try {
      const project = await Project.findOne({ _id: req.params.project_id });

      project.routes.unshift(newRoute);

      await project.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/projects/routes/:project_id/:route_id
// @desc     Delete package from project
// @access   Private
router.delete("/routes/:project_id/:route_id", auth, async (req, res) => {
  try {
    const foundProject = await Project.findOne({ _id: req.params.project_id });
    foundProject.routes = foundProject.routes.filter(
      (route) => route._id.toString() !== req.params.route_id
    );
    await foundProject.save();
    return res.status(200).json(foundProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    POST api/projects/packages/:project_id
// @desc     Add packages to project
// @access   Private
router.post(
  "/packages/:project_id",
  [auth, [check("name", "Packages's Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, documentationLink } = req.body;

    const newPackage = {
      name,
      documentationLink,
    };

    try {
      const project = await Project.findOne({ _id: req.params.project_id });

      project.packages.unshift(newPackage);

      await project.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/projects/packages/:project_id/:package_id
// @desc     Delete package from project
// @access   Private
router.delete("/packages/:project_id/:package_id", auth, async (req, res) => {
  try {
    const foundProject = await Project.findOne({ _id: req.params.project_id });
    foundProject.packages = foundProject.packages.filter(
      (package) => package._id.toString() !== req.params.package_id
    );
    await foundProject.save();
    return res.status(200).json(foundProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
