const { Book, Category, Author, Publisher, Review } = require("../db");
const { Op } = require("sequelize");

//----------- GET -----------//
exports.getAll = async function () {
  try {
    const catalog = await Book.findAll({
      order: [["title", "ASC"]],
      include: [
        { model: Category },
        { model: Author },
        { model: Publisher },
        { model: Review },
      ],
    });
    return catalog;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
exports.getById = async function (req, res) {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id, {
      include: [
        { model: Category },
        { model: Author },
        { model: Publisher },
        { model: Review },
      ],
    });
    if (book) return res.status(200).json(book);
    return res.json({ status: 404, message: "No se encontró el libro" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.getBook = async function (title) {
  try {
    const book = await Book.findAll({
      order: [["title", "ASC"]],
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
      include: [
        { model: Category },
        { model: Author },
        { model: Publisher },
        { model: Review },
      ],
    });
    return book;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

exports.getBookQty = async (req, res) => {
  try {
    return res.json(await Book.count());
  } catch (error) {
    console.log(error);
    return res.status(502).json(err);
  }
};

exports.getBooksCategoryAuthor = async (req, res) => {
  const { categoryId, authorId } = req.query;

  console.log(categoryId);
  console.log(authorId);
  try {
    const catalogue = await Book.findAll({
      order: [["title", "ASC"]],

      include: [Category, Publisher, Author, Review],
      where: {
        [Op.and]: [
          { "$categories.id$": Number(categoryId) },
          { "$authors.id$": Number(authorId) },
        ],
      },
    });
    if (catalogue.length) return res.status(200).json(catalogue);
    return res.json({ status: 404, message: "No se encontraron libros" });
  } catch (err) {
    console.log(err.message);
    return res.status(502).json(err);
  }
};

//----------- POST -----------//
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
exports.createBook = async (req, res) => {
  const {
    title,
    description,
    price,
    image,
    publisherId,
    publishedDate,
    pageCount,
    language,
    currentStock,
    categories,
    authors,
  } = req.body;
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
    return res
      .status(400)
      .json({ status: 400, message: "Error con las validaciones" });
  try {
    const newBook = await Book.create({
      title: title,
      description: description ? description : null,
      price: price ? parseFloat(price).toFixed(2) : 0,
      image: image,
      publisherId: publisherId ? parseInt(publisherId) : null,
      publishedDate: publishedDate ? publishedDate : null,
      pageCount: parseInt(pageCount),
      language: language ? language : null,
      currentStock: currentStock ? parseInt(currentStock) : 0,
      rating: 0,
    });
    // Relation with Publisher
    let publisherBook = await Publisher.findByPk(parseInt(publisherId));
    if (publisherBook) publisherBook.addBook(newBook);
    // Relation with Author
    if (authors?.length) {
      authors.map(async (a) => {
        const authorBook = await Author.findByPk(parseInt(a));
        if (authorBook) newBook.addAuthor(authorBook);
      });
      //Relation with Category
      if (categories?.length) {
        for (const c of categories) {
          if (c !== null || c !== undefined) {
            let categoryBook = await Category.findByPk(parseInt(c));
            if (categoryBook) newBook.addCategory(categoryBook);
          }
        }
      }
      let newBook2 = await Book.findByPk(newBook.id, {
        include: [{ model: Category }, { model: Author }, { model: Publisher }],
      });
      return res.status(201).json(newBook2);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//----------- PUT -----------//
exports.updateBook = async function (req, res) {
  const {
    title,
    description,
    price,
    image,
    publisherId,
    publishedDate,
    pageCount,
    language,
    currentStock,
    categories,
    authors,
  } = req.body;
  const { id } = req.params;

  try {
    const bookUpdate = await Book.findByPk(id);
    if (bookUpdate === null) {
      return res
        .status(404)
        .json({ status: 404, message: "No se encontró el libro" });
    }
    bookUpdate.title = title;
    bookUpdate.description = description ? description : null;
    bookUpdate.price = price ? parseFloat(price).toFixed(2) : 0;
    bookUpdate.image = image;
    bookUpdate.publisherId = publisherId ? parseInt(publisherId) : null;
    bookUpdate.publishedDate = publishedDate;
    bookUpdate.pageCount = pageCount;
    bookUpdate.currentStock = currentStock;
    //bookUpdate.rating = rating;
    bookUpdate.language = language ? language : "es";
    await bookUpdate.save();
    //Relation with Publisher
    let publisherBook = await Publisher.findByPk(publisherId);
    await publisherBook.setBooks(bookUpdate);
    // Relation with Author
    let authorBook = [];
    if (authors?.length) {
      for (const a of authors) {
        authorBook.push(await Author.findByPk(a));
      }
      await bookUpdate.setAuthors(authorBook);
    }
    //Relation with Category
    let categoryBook = [];
    if (categories?.length) {
      for (const c of categories) {
        if (c !== null || c !== undefined) {
          categoryBook.push(await Category.findByPk(c));
        }
      }
      await bookUpdate.setCategories(categoryBook);
    }
    // let newBook2= await Book.findByPk(bookUpdate.id, {
    // 	include: [
    // 		{ model: Category },
    // 		{ model: Author },
    // 		{ model: Publisher },
    // 	],})

    return res.status(204).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.logicalDeleteBook = async (req, res) => {
  const { id } = req.params;
  const { purge } = req.query; // por defecto es 0
  if (purge) {
    // borrado duro
    try {
      await Book.destroy({
        where: { id: id },
      });
      return res.status(204).json({});
    } catch (error) {
      console.log(error);
      return res.status(500).json(500);
    }
  }
  try {
    const disabledBook = await Book.findByPk(id);
    if (disabledBook) {
      const isActive = disabledBook.isActive ? false : true;
      await disabledBook.update({ isActive: isActive });
      if (isActive)
        return res
          .status(200)
          .json({ status: 200, message: "Activado con éxito" });
      return res.status(204).json({});
    }
    return res
      .status(404)
      .json({ status: 404, message: "No se encontró el libro" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
