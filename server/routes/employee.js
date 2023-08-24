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

// category schema to validate a new category
const categorySchema = {
  type: "object",
  properties: {
    categoryName: { type: "string" },
    backgroundColor: { type: "string" },
  },
  required: ["categoryName", "backgroundColor"],
  additionalProperties: false,
};

// define a schema to validate a new task
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
    category: categorySchema,
  },
  required: ["text", "category"],
  additionalProperties: false,
};

// findEmployeeById function - returns a single employee document from MongoDB Atlas
router.get("/:empId", (req, res, next) => {
  try {
    console.log("empId", req.params.empId);
    let { empId } = req.params; // get the empId
    empId = parseInt(empId, 10); // parse the empId to an int

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId }); // query MongoDB Atlas by empId

      // log the employee object to the console
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

    let { empId } = req.params; // get the EmpId from the request object
    empId = parseInt(empId, 10); // parse the empId to an int value

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne({ empId }, { projection: { empId: 1, todo: 1, done: 1 } });

      console.log("tasks", tasks);

      // if the tasks array is empty, return a 404 error
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

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }
    // call the mongo function
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      console.log("employee", employee);
      // if the employee object is empty, return a 400 error
      if (!employee) {
        const err = new Error("Unable to find employee with empId" + empId);
        err.status = 400;
        console.log("err", err);
        next(err);
        return;
      }

      const { task } = req.body;
      console.log("New task: ", task);
      console.log("body", req.body);

      // validate the request object against the task schema
      const validator = ajv.compile(taskSchema);
      const valid = validator(task);

      console.log("valid", valid);

      if (!valid) {
        const err = new Error("bad Request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err);
        next(err);
        return;
      }

      // build the task object to insert into MongoDB atlas (i.e. the new task)
      const newTask = {
        _id: new ObjectId(),
        text: task.text,
        category: task.category,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: newTask } });

      console.log("result", result);

      // if the result object is empty, return a 404 error
      if (!result.modifiedCount) {
        const err = new Error("Unable to create tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// exports router as a module
module.exports = router;
