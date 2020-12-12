const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Project = require("../../models/Project");

// @route    GET api/projects/me
// @desc     Get current user's projects
// @access   Private
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
router.get("/:project_id", auth, async ({ params: { project_id } }, res) => {
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

		let newModel = {
			name,
			description,
			properties: [],
		};

		console.log(req.body.properties);

		for (let i = 0; i < req.body.properties.length; i++) {
			let newProperty = {
				propName: req.body.properties[i].propName,
				propType: req.body.properties[i].propType,
				requiredProp: req.body.properties[i].requiredProp,
			};

			newModel.properties.unshift(newProperty);
			console.log(newModel);
		}

		try {
			const project = await Project.findOne({
				_id: req.params.project_id,
			});

			project.models.push(newModel);

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
		const foundProject = await Project.findOne({
			_id: req.params.project_id,
		});
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

// @route    POST api/projects/models/properties/:project_id/:model_id
// @desc     Add properties to model in project
// @access   Private
router.post(
	"/models/properties/:project_id/:model_id",
	[
		auth,
		[check("propName", "Propertys Name is required").not().isEmpty()],
		[check("propType", "Propertys Type is required").not().isEmpty()],
		[
			check("requiredProp", "Please specify if this Property is required")
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { propName, propType, requiredProp } = req.body;

		let newProperty = {
			propName,
			propType,
			requiredProp,
		};

		try {
			const project = await Project.findOne({
				_id: req.params.project_id,
			});

			let modelIndex = 0;
			for (let i = 0; i < project.models.length; i++) {
				if (project.models[i]._id == req.params.model_id) {
					modelIndex = i;
				}
			}

			project.models[modelIndex].properties.push(newProperty);

			await project.save();

			res.json(project);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route    DELETE api/projects/models/properties/:project_id/:model_id/:property_id
// @desc     Delete property from model
// @access   Private
router.delete(
	"/models/properties/:project_id/:model_id/:property_id",
	auth,
	async (req, res) => {
		try {
			const project = await Project.findOne({
				_id: req.params.project_id,
			});

			let modelIndex = 0;
			for (let i = 0; i < project.models.length; i++) {
				if (project.models[i]._id == req.params.model_id) {
					modelIndex = i;
				}
			}

			project.models[modelIndex].properties = project.models[
				modelIndex
			].properties.filter(
				(property) => property._id.toString() !== req.params.property_id
			);

			await project.save();
			return res.status(200).json(project);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

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
			const project = await Project.findOne({
				_id: req.params.project_id,
			});

			project.routes.push(newRoute);

			await project.save();

			res.json(project);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route    DELETE api/projects/routes/:project_id/:route_id
// @desc     Delete route from project
// @access   Private
router.delete("/routes/:project_id/:route_id", auth, async (req, res) => {
	try {
		const foundProject = await Project.findOne({
			_id: req.params.project_id,
		});
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
			const project = await Project.findOne({
				_id: req.params.project_id,
			});

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
		const foundProject = await Project.findOne({
			_id: req.params.project_id,
		});
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
