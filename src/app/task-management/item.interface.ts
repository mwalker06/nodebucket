/* Title: item.interface
Author: Megan Walker
Date: 08-24-2023
Description: item.interface.ts
Source: Professor Krasso */


// Item interface with _id, text, and category
export interface Category {
    categoryName: string
    backgroundColor: string
}

// Item interface with _id, text, and category
export interface Item {
    _id?: string //optional property
    text: string
    category: Category
}