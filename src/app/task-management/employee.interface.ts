/* Title: employee.interface
Author: Megan Walker
Date: 08-24-2023
Description: employee.interface.ts
Source: Professor Krasso */

// imports
import { Item } from "./item.interface";

// Employee interface with empId, todo, and done
export interface Employee {
    empId: number
    todo: Item[]
    done: Item[]
}