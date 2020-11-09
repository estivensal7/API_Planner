const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
// const path = require("path");
const cors = require("cors");

const app = express();

// Enabling CORS
app.use(cors());

// Init Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initializing Routes
app.use(routes);

// Connect Database
connectDB();

// Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
