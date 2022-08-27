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
            // { include: Review, Publisher }
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

        return bookFound.length > 0 ? bookFound : undefined;
    }),
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
    if (disabledBook) {
        await disabledBook.update({ isActive: false });
        return disabledBook;
    }
    return undefined;
};

module.exports = {
    getAll,
    getBook,
    getById,
    createBook,
    updateBook,
    logicalDeleteBook,
    getBookByAuthor,
    getBookByCategory,
};
