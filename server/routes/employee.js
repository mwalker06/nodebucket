/* Title: employee
Author: Megan Walker
Date: 08-14-2023
Description: employee API
Source: Professor Krasso */

"use strict";

// imports / requires
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
// imports another json validator
const Ajv = require("ajv");
const { ObjectId, ReturnDocument } = require("mongodb");
const { restart } = require("nodemon");

const ajv = new Ajv(); // create a new instance of the Ajv class

// define a schema to validate a new task
// TODO: figure out why this is not preventing additional properties
// TODO: as of now it is allowing us to send a second property of bar
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

// findAllEmployees function - returns all employees
router.get("/:empId", (req, res, next) => {
  try {
    console.log("empId", req.params.empId);
    let { empId } = req.params; // get the empId from the req.params object
    empId = parseInt(empId, 10); // try to determine if the empId is a numerical value

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }
    // call the mongo helper method
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId }); // find employee by ID

      // error handling for employee not found
      if (!employee) {
        const err = new Error("Unable to find employee with ID " + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      res.send(employee);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// findAllTasks function - returns all tasks for a given employee
router.get("/:empId/tasks", (req, res, next) => {
  try {
    console.log("findAllTasks API");

    let { empId } = req.params; // get the EmpId
    empId = parseInt(empId, 10); // parse the empId to an int

    // error handling for non-numerical empId
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }
    // call the mongo helper method to find the employee
    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne({ empId }, { projection: { empId: 1, todo: 1, done: 1 } });

      console.log("tasks", tasks);

      // error handling for employee not found in the database
      if (!tasks) {
        const err = new Error("Unable to find tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(tasks); // return the tasks array
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// createTask function - creates a new task for a given employee
router.post("/:empId/tasks", (req, res, next) => {
  try {
    console.log("createTask API");

    let { empId } = req.params;
    empId = parseInt(empId, 10);
    // error handling for non-numerical empId
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo helper method to find the employee
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      console.log("employee", employee);

      // error handling for employee not found in the database
      if (!employee) {
        const err = new Error("Unable to find employee with empId" + empId);
        err.status = 400;
        console.log("err", err);
        next(err);
        return;
      }

      const { text } = req.body;
      console.log("req.body", req.body);

      // validate the request object against the schema
      const validator = ajv.compile(taskSchema);
      const valid = validator({ text });

      console.log("valid", valid);
      // error handling for invalid request object
      if (!valid) {
        const err = new Error("bad Request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err);
        next(err);
        return;
      }

      const task = {
        _id: new ObjectId(),
        text,
      };
      // call the mongo helper method to update the employee's todo array with the new task
      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: task } });

      console.log("result", result);
      // error handling for failed update operation
      if (!result.modifiedCount) {
        const err = new Error("Unable to create tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      // return the new task id to the client
      res.status(201).send({ id: task._id });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// exports router module
module.exports = router;
