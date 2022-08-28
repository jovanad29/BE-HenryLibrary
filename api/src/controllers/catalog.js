const { Book, Category, Author, Publisher, Review } = require("../db");
const { Op } = require("sequelize");

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll = async function (pagina, itemsPagina) {
  const offset = pagina * itemsPagina;
  const limit = itemsPagina;
  const catalog = await Book.findAll({
    offset: offset,
    limit: limit,
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

  return catalog.length > 0 ? catalog : undefined;
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

  return book ? book : undefined;
};

getBook = async function (title, pagina, itemsPagina) {
  const offset = pagina * itemsPagina;
  const limit = itemsPagina;
  const book = await Book.findAll({
    offset: offset,
    limit: limit,
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
      // { model: Review, }
    ],
  });

  return book ? book : undefined;
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

  return bookFound.length > 0 ? bookFound : undefined;
}
  //filter by Category
 getBookByCategory = async function (IdCategory) {
    const bookFound = await Book.findAll({
      include: [
        {
          model: Category,
          where: {
            id: IdCategory,
          },
        },
        {
          model: Author,
        },
        {
          model: Publisher,
        },
      ],
    });

    return bookFound;
  }
  //----------------------------------------------------------------------------------------------
  //    POSTS
  //
  //-----------------------------------------------------------------------------------------
  createBook = async function ({
    title,
    description,
    price,
    image,
    publisherId,
    publishedDate,
    pageCount,
    rating,
    language,
    currentStock,
    categories,
    authors,
  }) {
    try {
      const newBook = await Book.create({
        title: title,
        description: description ? description : "No description",
        price: price ? price.toFixed(2) : 0,
        image: image,
        publisherId: publisherId ? publisherId : null,
        publishedDate: publishedDate ? publishedDate : "NO DATE",
        pageCount: pageCount ? pageCount : 0,
        rating: rating ? rating : 0,
        language: language ? language : "NO INFO",
        currentStock: currentStock ? currentStock : 0,
      });

      // Relation with Publisher
      let publisherBook = await Publisher.findByPk(publisherId);
      if (publisherBook) publisherBook.addBook(newBook);

      // Relation with Author
      if (authors.length) {
        authors.map(async (a) => {
          // console.log(a);
          const authorBook = await Author.findByPk(a);
          if (authorBook) authorBook.addBook(newBook);
        });

        //Relation with Category
        if (categories.length) {
          for (const c of categories) {
            if (c !== null || c !== undefined) {
              // console.log(c)
              let categoryBook = await Category.findByPk(c);
              //console.log(categoryBook)
              if (categoryBook) newBook.addCategory(categoryBook);
            }
          }
        }
        return newBook;
      }
    } catch (error) {
      return error;
    }
  };

//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
modifyBook = async function ({
    title,
    description,
    price,
    image,
    publisherId,
    publishedDate,
    pageCount,
    rating,
    language,
    currentStock,
    categories,
    authors
  } , id) {
   
 

//   if (Object.keys(changes).length === 0) {
//     return null;
//   }

  try {
    const bookUpdate = await Book.findByPk(id);
    if (bookUpdate === null) {
      return null;
    }
 bookUpdate.title=title
 bookUpdate.description=description
 bookUpdate.price=price
 bookUpdate.image=image
 bookUpdate.publisherId=publisherId
 bookUpdate.publishedDate=publishedDate
 bookUpdate.pageCount=pageCount
 bookUpdate.currentStock=currentStock
 bookUpdate.rating=rating
 bookUpdate.language=language
 await bookUpdate.save()
    // await bookUpdate.update({
    //   title,
    //   description,
    //   price,
    //   image,
    //   publishedDate,
    //   publisherId,
    //   pageCount,
    //   language,
    //   currentStock,
    //   rating,

    // });
    console.log(bookUpdate)
    // Relation with Publisher
  
    // let publisherBook = await Publisher.findByPk(publisherId);
    // let newPublisher=[]
    //     newPublisher.push(bookUpdate)
    //      console.log(newPublisher)
    // await   publisherBook.setBook([bookUpdate])

    // Relation with Author

    let authorBook=[]
    if (authors.length) {
        for (const a of authors) {
         console.log(a);
         authorBook.push( await Author.findByPk(a));
       
      };
       await  bookUpdate.setAuthor(authorBook);
    }

      //Relation with Category
      let categoryBook=[]
      if (categories.length) {
        for (const c of categories) {
          if (c !== null || c !== undefined) {
            // console.log(c)
            categoryBook.push( await Category.findByPk(c));
            //console.log(categoryBook)
           
          }
        }
        await bookUpdate.setCategory(categoryBook);
      }
      return bookUpdate;
      
  } catch (error) {
    return error;
  }
}

//----------------------------------------------------------------------------------------------
//     DELETE LOGICO
//----------------------------------------------------------------------------------------------
logicalDeleteBook = async function (id) {
  const disabledBook = await Book.findByPk(id);
  if (disabledBook) {
    const deleted = disabledBook.isActive === true ? false : true;
    await disabledBook.update({ isActive: deleted });
    return disabledBook;
  }
  return undefined;
};

//--------------------------------------------------------------------------------------------
//    DISABLE A BOOK
//--------------------------------------------------------------------------------------------
bannedBook = async function (id) {
  const bannedBook = await Book.findByPk(id);
  if (bannedBook) {
    const banned = bannedBook.isBanned === false ? true : false;
    await bannedBook.update({ isBanned: banned });
    return bannedBook;
  }
  return undefined;
};

//--------------------------------------------------------------------------------------------
//    COUNT ALL BOOKS
//--------------------------------------------------------------------------------------------
getCountBooks = async function () {
  const count = await Book.count();
  return count ? count : undefined;
};

module.exports = {
  getAll,
  getBook,
  getById,
  createBook,
  modifyBook,
  logicalDeleteBook,
  getBookByAuthor,
  getBookByCategory,
  bannedBook,
  getCountBooks,
};
