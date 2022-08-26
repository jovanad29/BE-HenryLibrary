const axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Book,  Author, Category, Review } = require('../db');

let BooksModel = {
getBookByCategory: async function (IdAuthor) {
    const bookFound = await Book.findAll(
        {include: Author, where:{
                           id: IdAuthor
    }},
     {include: Category, Review ,Publisher})
   

    if (bookFound.length === 0) {
      return undefined;
    }

    return bookFound;
  },
}

module.exports=BooksModel;