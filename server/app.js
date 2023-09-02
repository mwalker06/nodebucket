/* Title: app
Author: Megan Walker
Date: 08-24-2023
Description: app.js file
Source: Professor Krasso  */

"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");
const employeeRoute = require("./routes/employee");
const swaggerUi = require("swagger-ui-express");
const api_docs = require("../api-docs.json");

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/api/employees", employeeRoute);

// Swagger Setup & wiring
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(api_docs));

// error handler for 404 errors and forward to error handler
app.use(function (req, res, next) {
  next(createServer(404));
});

// error handler for all other errors and forward to error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

module.exports = app; // export the Express application
