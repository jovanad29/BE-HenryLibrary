const { Book, Category, Author, Publisher, Review } = require("../db");
const { Op } = require("sequelize");

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll = async function (pagina, itemsPagina) {
    const offset = pagina * itemsPagina;
    const limit = itemsPagina;
    const catalog = await Book.findAll({
        // offset: offset,
        // limit: limit,
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
        // offset: offset,
        // limit: limit,
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

    return book.length > 0 ? book : undefined;
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
};
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

    return bookFound.length > 0 ? bookFound : undefined;
};
//----------------------------------------------------------------------------------------------
//    POSTS
//
//-----------------------------------------------------------------------------------------
function validations(
    title,
    description,
    price,
    image,
    pageCount,
    currentStock
) {
    if (!title || title === undefined || title.length > 300) return false;

    if (!description || description === undefined || description.length > 5200)
        return false;

    if (!price || price < 0 || price === undefined) return false;

    const patternURL = new RegExp(
        /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi
    );

    if (!image || image === undefined || !patternURL.test(image)) return false;

    if (!pageCount || pageCount < 0 || pageCount === undefined) return false;

    if (!currentStock || currentStock < 0 || currentStock === undefined)
        return false;

    return true;
}

createBook = async function ({
    title,
    description,
    price,
    image,
    publisherId,
    publishedDate,
    pageCount,
    languages,
    currentStock,
    categories,
    authors,
}) {
    if (
        !validations(
            title,
            description,
            price,
            image,
            pageCount,
            languages,
            currentStock
        )
    )
        return undefined;
    try {
        let newBook = await Book.create({
            title: title,
            description: description,
            price: price ? parseFloat(price).toFixed(2) : 0,
            image: image,
            publisherId: publisherId ? parseInt(publisherId) : null,
            publishedDate: publishedDate ? publishedDate : "NO DATE",
            pageCount: parseInt(pageCount),
            language: languages ? languages : "NO INFO",
            currentStock: currentStock ? parseInt(currentStock) : 0,
        });

        // Relation with Publisher
        let publisherBook = await Publisher.findByPk(parseInt(publisherId));
        if (publisherBook) publisherBook.addBook(newBook);

        // Relation with Author
        if (authors?.length) {
            authors.map(async (a) => {
                const authorBook = await Author.findByPk(parseInt(a));
                if (authorBook) authorBook.addBook(newBook);
            });
        }

        //Relation with Category
        if (categories?.length) {
            for (const c of categories) {
                if (c !== null || c !== undefined) {
                    let categoryBook = await Category.findByPk(parseInt(c));

                    if (categoryBook) newBook.addCategory(categoryBook);
                }
            }
        }
        return newBook;
    } catch (error) {
        console.log(error);
        return error;
    }
};

//----------------------------------------------------------------------------------------------
//    PUTS  Modify Book
//----------------------------------------------------------------------------------------------
modifyBook = async function (
    {
        title,
        description,
        price,
        image,
        publisherId,
        publishedDate,
        pageCount,
        //rating,
        language,
        currentStock,
        categories,
        authors,
    },
    id
) {
    if (
        !validations(
            title,
            description,
            price,
            image,
            pageCount,
            language,
            currentStock
        )
    )
        return undefined;
    try {
        const bookUpdate = await Book.findByPk(id);
        if (bookUpdate === null) {
            return null;
        }
        bookUpdate.title = title;
        bookUpdate.description = description;
        bookUpdate.price = price;
        bookUpdate.image = image;
        bookUpdate.publisherId = publisherId;
        bookUpdate.publishedDate = publishedDate;
        bookUpdate.pageCount = pageCount;
        bookUpdate.currentStock = currentStock;
        //bookUpdate.rating = rating;
        bookUpdate.language = language;

        await bookUpdate.save();

        //Relation with Publisher
        let publisherBook = await Publisher.findByPk(publisherId);
        await publisherBook.setBooks(bookUpdate);

        // Relation with Author
        let authorBook = [];
        if (authors.length) {
            for (const a of authors) {
                authorBook.push(await Author.findByPk(a));
            }
            await bookUpdate.setAuthors(authorBook);
        }
        //Relation with Category
        let categoryBook = [];
        if (categories.length) {
            for (const c of categories) {
                if (c !== null || c !== undefined) {
                    categoryBook.push(await Category.findByPk(c));
                }
            }
            await bookUpdate.setCategories(categoryBook);
        }
        return bookUpdate;
    } catch (error) {
        return error;
    }
};

//----------------------------------------------------------------------------------------------
//     DELETE LOGICO
//----------------------------------------------------------------------------------------------
logicalDeleteBook = async function (id) {
    const disabledBook = await Book.findByPk(id, {
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
    const bannedBook = await Book.findByPk(id, {
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
