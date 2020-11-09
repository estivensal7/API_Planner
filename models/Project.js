const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  models: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      properties: [
        {
          name: {
            type: String,
            required: true,
          },
          requiredProp: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  routes: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      path: {
        type: String,
      },
    },
  ],
  packages: [
    {
      name: {
        type: String,
        required: true,
      },
      documentationLink: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("project", ProjectSchema);
