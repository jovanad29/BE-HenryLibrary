const axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Book,  Author, Category, Review } = require('../db');
const { imageRegex } = require('../utils/validations/regex');
const { imgVerify } = require('./BooksWithLargeImage');


let BooksModel = {
getBookByTitle: async function (IdCategory) {
    const bookFound = await Book.findAll(
        {include:Category,where:{
                           id: IdCategory
    }},
     {include: Review},
     {include:Author})
    

    if (bookFound.length === 0) {
      return undefined;
    }

    return bookFound;
  },
}

module.exports=BooksModel;