const axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Book,  Author, Category, Review } = require('../db');



let BooksModel = {
getBookByCategory: async function (IdCategory) {
    const bookFound = await Book.findAll(
        {include:Category, where:{
                           id: IdCategory
    }},
     {include: Review,Author,Publisher})
   

    if (bookFound.length === 0) {
      return undefined;
    }

    return bookFound;
  },
}

module.exports=BooksModel;