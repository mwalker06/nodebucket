/* Title: employee
Author: Megan Walker
Date: 08-14-2023
Description: employee API
Source: Professor Krasso */

"use strict";

"use strict";

// imports / requires
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
// imports another json validator
const Ajv = require("ajv");
const { ObjectId, ReturnDocument } = require("mongodb");
const { restart } = require("nodemon");
const { response } = require("express");
const { todo } = require("node:test");

const ajv = new Ajv(); // create a new instance of the Ajv class

// category schema to validate the category object
const categorySchema = {
  type: "object",
  properties: {
    categoryName: { type: "string" },
    backgroundColor: { type: "string" },
  },
  required: ["categoryName", "backgroundColor"],
  additionalProperties: false,
};

// define a schema for the task object
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
    category: categorySchema,
  },
  required: ["text", "category"],
  additionalProperties: false,
};

// defines the tasks schema to validate the request body
const tasksSchema = {
  type: "object",
  required: ["todo", "done"],
  additionalProperties: false,
  properties: {
    todo: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          category: categorySchema,
        },
        required: ["_id", "text", "category"],
        additionalProperties: false,
      },
    },
    done: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          category: categorySchema,
        },
        required: ["_id", "text", "category"],
        additionalProperties: false,
      },
    },
  },
};

// findEmployeeById function - returns a single employee document from MongoDB Atlas
router.get("/:empId", (req, res, next) => {
  try {
    console.log("empId", req.params.empId);
    let { empId } = req.params; // get the empId from the req.params object and assign it to the empId variable
    empId = parseInt(empId, 10); // try to determine if the empId is a numerical value and if so, parse it to an integer

    // if the empId is not a number, return a 400 error message
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo function and pass in the async callback function
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId }); // find employee by ID

      // return the employee object if it exists if not return a 404 error message
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

    let { empId } = req.params; // get the EmpId from the req.params object and assign it to the empId variable
    empId = parseInt(empId, 10); // parse the empId to an int value and assign it to the empId variable

    // if the empId is not a number, return a 400 error message
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo function and pass in the async callback function
    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne({ empId }, { projection: { empId: 1, todo: 1, done: 1 } });

      console.log("tasks", tasks);

      // return the tasks object if it exists if not return a 404 error message
      if (!tasks) {
        const err = new Error("Unable to find tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(tasks); // return the tasks array to the client
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

    // if empId isn't a number, return an error message 400
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo function and pass in the async callback function
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      console.log("employee", employee);

      // if you can't find the employee ID error handling
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

      // if the request object doesn't match the schema, return a 400 error message
      if (!valid) {
        const err = new Error("bad Request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err);
        next(err);
        return;
      }

      // build the task object to insert into MongoDB atlas using the request body
      const newTask = {
        _id: new ObjectId(),
        text: task.text,
        category: task.category,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: newTask } });

      console.log("result", result);

      // if the result object doesn't contain a modified count, return a 404 error message
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

// update task API - updates the tasks for a given employee
router.put("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // return a 400 error message if the empId is not a number
    if (isNaN(empId)) {
      const err = new Error("input must be an number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo function and pass in the async callback function
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });
      console.log("employee", employee);

      // if you can't find the employee ID error handling
      if (!employee) {
        const err = new Error("unable to find employee with empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      const tasks = req.body;
      console.log("tasks", tasks);

      // validate the request object against the tasks schema
      const validator = ajv.compile(tasksSchema);
      const valid = validator(tasks);

      console.log("valid", valid);

      // if the request object doesn't match the schema, return a 400 error message
      if (!valid) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err); // helps with troubleshooting
        next(err);
        return;
      }

      // update the tasks for the given employee
      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $set: { todo: tasks.todo, done: tasks.done } });

      // if the result object doesn't contain a modified count, return a 404 error message
      if (!result.modifiedCount) {
        const err = new Error("Unable to update tasks for empId " + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      res.status(204).send();
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// delete task API - deletes a task for a given employee
router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  try {
    let { empId } = req.params;
    const { taskId } = req.params;
    console.log(`EmpID: ${empId}; TaskId: ${taskId}`);
    empId = parseInt(empId, 10); // parse the empId integer from the string value and assign it to the empId variable

    // if the empId is not a number, return a 400 error message
    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    // call the mongo function and pass in the async callback function
    mongo(async (db) => {
      let emp = await db.collection("employees").findOne({ empId });
      console.log("emp", emp);

      // 404 error handling if the employee ID is not found
      if (!emp) {
        const err = new Error("unable to find employee with empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      // if the todo and done arrays are null, set them to empty arrays
      if (!emp.todo) emp.todo = [];
      if (!emp.done) emp.done = [];

      // filter the todo and done arrays to remove the task with the matching taskId
      const todoItems = emp.todo.filter(
        (task) => task._id.toString() !== taskId.toString()
      );

      // filter the done array to remove the task with the matching taskId
      const doneItems = emp.done.filter(
        (task) => task._id.toString() !== taskId.toString()
      );

      // log the todo and done arrays to the console
      console.log(`Todo item: ${todoItems}; Done Item: ${doneItems}`);

      // update the todo and done arrays in MongoDB Atlas
      const result = await db
        .collection("employees")
        .updateOne(
          { empId: empId },
          { $set: { todo: todoItems, done: doneItems } }
        );

      console.log("result", result); // logging for troubleshooting assistance
      res.status(204).send(); // send a successful status code
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// exports router module
module.exports = router;
