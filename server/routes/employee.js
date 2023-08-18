/* Title: employee
Author: Megan Walker
Date: 08-14-2023
Description: employee API
Source: Professor Krasso */

'use strict'

const express = require('express');
const router = express.Router();
const { mongo } = require('../utils/mongo');

//findEmployeeById
router.get('/:empId', async (req, res, next) => {
    try {
        let { empId } = req.params //get empId from request
        empId = parseInt(empId, 10) //parse empId to integer

        if (isNaN(empId)) {
            const err = new Error('Input must be a number')
            err.status = 400
            console.log('err', err)
            next(err)
            return
        }

        mongo(async db => {
            const employee = await db.collection('employees').findOne({ empId }) //find employee by empId

            if (!employee) {
            const err = new Error('Employee not found with empId ' + empId)
            err.status = 404
            console.log('err', err)
            next(err)
            return
        }

        res.send (employee) //return employee
        }, next)

    } catch (err) {
        console.log('err', err)
        next(err)
    }
})

module.exports = router