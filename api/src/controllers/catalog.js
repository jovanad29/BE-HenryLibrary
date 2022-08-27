const axios = require("axios");
const Sequelize = require("sequelize");
const { Book, Category, Author ,Publisher, Review} = require("../db");
const { Op } = require("sequelize");

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll = async function () {
    const catalog = await Book.findAll({
        order: [["title", "ASC"]],
        include: [
            {
                model: Category,
            },
            {
                model: Author,
            },
             {
             model: Publisher,
          },
           
          // { model: Review , }
        ],
    });

    if (catalog.length > 0) {
        return catalog;
    } else {
        return undefined;
    }
};

getById = async function (id) {
    const book = await Book.findByPk(id, {
        include: [
            {
                model: Category,
            },
            {
                model: Author,
            },
            {
               model: Publisher,
            },
        ],
    });
    if (book) {
        return book;
    } else {
        return undefined;
    }
};

getBook = async function (title) {
    const book = await Book.findAll({
        order: [["title", "ASC"]],
        where: {
            title: {
                [Op.iLike]: `%${title}%`,
            },
        },
        include: [
            {
                model: Category,
            },
            {
                model: Author,
            },
            {
              model: Publisher,
            },
            // { include: Review, Publisher }
        ],
    });
    if (book) {
        return book;
    } else {
        return undefined;
    }
};

//filter by Author
  getBookByAuthor = async function (IdAuthor) {
    const bookFound = await Book.findAll({
      include: [
        {
          model: Author,
          where: {
            id: IdAuthor,
          },
        },
        {
          model: Category,
        },
        {
          model: Publisher,
        },
        // {model: Review }
      ],
    });

    if (bookFound.length === 0) {
      return undefined;
    }
    return bookFound;
  },
  
//filter by Category
  getBookByCategory = async function (IdCategory) {
    const bookFound = await Book.findAll(
      {
        include: [
          {
            model: Category,
            where: {
              id: IdCategory
            },
          },
          {
            model: Author,
          },
          {
            model: Publisher,
          },
        ],

      },
      
    );

    if (bookFound.length === 0) {
      return undefined;
    }

    return bookFound;
  },
//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
    (createBook = async function (book) {
      const newBook = await Book.create(book);
      return newBook;
    });

//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
updateBook = async function (id, book) {
    const updatedBook = await Book.update(book, {
        where: {
            id: id,
        },
    });
    return updatedBook;
};


//----------------------------------------------------------------------------------------------
//     DELETE LOGICO
//----------------------------------------------------------------------------------------------
logicalDeleteBook = async function (id) {
  const disabledBook = await Book.findByPk(id);
  if (disabledBook){
      const deleted= disabledBook.isActive === true? false: true;
       await disabledBook.update({ isActive: deleted });
      return disabledBook;
  }
  return undefined
 
}   

//--------------------------------------------------------------------------------------------
//    DISABLE A BOOK
//--------------------------------------------------------------------------------------------
bannedBook = async function (id) { 
  const bannedBook = await Book.findByPk(id);
  if (bannedBook){
      const banned= bannedBook.isBanned === false? true: false;
        await bannedBook.update({ isBanned : banned });
        return bannedBook;
  }
  return undefined
}



module.exports = {  getAll,getBook,getById,createBook,updateBook,logicalDeleteBook, getBookByAuthor, getBookByCategory};
