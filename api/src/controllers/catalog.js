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
(getBookByAuthor = async function (IdAuthor) {
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

}),
    //filter by Category
    (getBookByCategory = async function (IdCategory) {
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
  },
//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  //                                  CREATE
  //-----------------------------------------------------------------------------------------
  createBook= async function ({title, description, price, image, publisherId, publishedDate, pageCount, rating ,language, currentStock, categories, authors}) {

   
 

    try {
      let publisherBook = await Publisher.findByPk(publisherId) 

      const newBook = await Book.create({
  
          title: title,
          description: description ? description : "No description",
          price: price ? (price).toFixed(2): 0,
          image: image,
          publisherId: publisherId ? publisherId : null,
          publishedDate: publishedDate ? publishedDate : "NO DATE",
          pageCount: pageCount ? pageCount : 0,
          rating: rating ? rating : 0,
          language: language ? language : "NO INFO",
          currentStock: currentStock ? currentStock : 0,
        
      });
  
      if (publisherBook) publisherBook.addBook(newBook)

      // Relation with Author
      //console.log(newBook[0])
      authors.map(async (a) => {
       // console.log(a);

        const authorBook = await Author.findByPk(a);
        //console.log(authorBook )
        if (authorBook) authorBook.addBook(newBook);
      });

      //Relation with Category

      if (categories.length) {
        for (const c of categories) {
          if (c !== null || c !== undefined)
           {

          // console.log(c)
            let categoryBook = await Category.findByPk(c);
            //console.log(categoryBook)
            if (categoryBook) newBook.addCategory(categoryBook);
          }
        }
      }
      return newBook;
    } catch (error) {
      return error;
    }
  });

//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
modifyBook=async function (changes, id) {
  if (Object.keys(changes).length === 0) {
    return null;
  }

  // const authorValue = changes.authors.map((a) => a.value);
  // const authorCreated = changes.authors.map((a) => a.created);
  // const categoryValue = changes.categories.map((c) => c.value);
  // const categoryCreated = changes.categories.map((c) => c.created);

  // for (let i = 0; i < changes.authors.length; i++) {
  //   if (authorCreated[i]) {
  //     Authors.findOrCreate({
  //       where: { name: authorValue[i] },
  //     });
  //   }
  // }

  // for (let i = 0; i < changes.categories.length; i++) {
  //   if (categoryCreated[i]) {
  //     Categories.findOrCreate({
  //       where: { category: categoryValue[i] },
  //     });
  //   }
  // }

  try {
    const book = await book.findByPk(id);
    if (book === null) {
      return null;
    }
    
    await book.update({
      title: changes.title.toLowerCase(),
      description: changes.description.toLowerCase(),
      price: changes.price,
      // authors: authorValue,
      // categories: categoryValue,
      image: changes.image,
      publishedDate: changes.publishedDate,
      publisher: changes.publisher,
      pageCount: changes.pageCount,
      language: changes.language,
      
    });
    return book;
  } catch (error) {
    return null;
  }
}

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



module.exports = {  getAll,getBook,getById,createBook,modifyBook,logicalDeleteBook, getBookByAuthor, getBookByCategory, bannedBook };
