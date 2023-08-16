/* Title: mongo
Author: Megan Walker
Date: 08-14-2023
Description: mongoDB connection
Source: Professor Krasso, Angular.io */

"use strict";

const { MongoClient } = require("mongodb")

const MOGODB_URL =
  "mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.1txnlsv.mongodb.net/?retryWrites=true&w=majority";

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to Mongodb Atlas...")

    //connect to client
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    //connect to db
    const db = client.db('nodebucket')
    console.log("Connected to Mongodb Atlas")

    //call operations
    await operations(db);
    console.log("Operation was successful")

    //close connection
    client.close();
    console.log("Connection to Mongodb Atlas closed")

    //catch errors
  } catch (err) {
    const error = new Error("Error  connecting to db", err)
    error.status = 500;
    console.log("Error connecting to db", err)
    next(error);
  }
}

//export module
module.exports = { mongo }
