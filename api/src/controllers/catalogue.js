const { Book, Category, Author, Publisher, Review } = require('../db');
const { Op } = require('sequelize');


//----------- GET -----------//
exports.getAll = async function(pagina, itemsPagina) {
	try {
		const offset = pagina * itemsPagina;
		const limit = itemsPagina;
		const catalog = await Book.findAll({
			offset: offset,
			limit: limit,
			order: [['title', 'ASC']],
			include: [
				{ model: Category },
				{ model: Author },
				{ model: Publisher },
				// { model: Review }
			],
		});
		return catalog
	} catch (error) {
		console.log(error)
		return undefined
	}
};
exports.getById = async function(req, res) {
	const { id } = req.params
	try {
		const book = await Book.findByPk(id, {
			include: [
				{ model: Category },
				{ model: Author },
				{ model: Publisher },
			],
		});
		if (book) return res.status(200).json(book);
		return res.status(404).json({status:404,message:'No se encontró el libro'});
	} catch (error) {
		console.log(error)
		return res.status(500).json(error);
	}
};
exports.getBook = async function(title, pagina, itemsPagina) {
	try {
		const offset = pagina * itemsPagina;
		const limit = itemsPagina;
		const book = await Book.findAll({
			offset: offset,
			limit: limit,
			order: [['title', 'ASC']],
			where: {
				title: {
					[Op.iLike]: `%${title}%`,
				},
			},
			include: [
				{ model: Category },
				{ model: Author },
				{ model: Publisher },
				// { model: Review }
			],
		});
		return book
	} catch (error) {
		console.log(error)
		return undefined
	}
};
//filter by Author
// exports.getBookByAuthor = async function(idAuthor) {
// 	try {
// 		const bookFound = await Book.findAll({
// 			include: [
// 				{
// 					model: Author,
// 					where: {
// 						id: idAuthor,
// 					},
// 				},
// 				{ model: Category },
// 				{ model: Publisher },
// 				// {model: Review }
// 			],
// 		});
// 		return bookFound
// 	} catch (error) {
// 		console.log(error)
// 		return undefined
// 	}
// }
//filter by Category
exports.getBookByCategory = async function(idCategory) {
	try {
		const bookFound = await Book.findAll({
			include: [
				{
					model: Category,
					where: {
						id: idCategory,
					},
				},
				{ model: Author },
				{ model: Publisher },
			],
		});
		return bookFound;		
	} catch (error) {
		console.log(error)
	}
}
exports.getCountBooks = async function() {
	try {
		return await Book.count()
	} catch (error) {
		console.log(error)
		return undefined
	}
};

//----------- POST -----------//
exports.createBook = async function(body) {
	const {
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
	} = body
	try {
		const newBook = await Book.create({
			title: title,
			description: description ? description : 'NO DESCRIPTION AVAILABLE',
			price: price ? price.toFixed(2) : 0,
			image: image,
			publisherId: publisherId ? publisherId : null,
			publishedDate: publishedDate ? publishedDate : null,
			pageCount: pageCount ? pageCount : 0,
			rating: rating ? rating : 0,
			language: language ? language : null,
			currentStock: currentStock ? currentStock : 0,
		});
		// Relation with Publisher
		let publisherBook = await Publisher.findByPk(publisherId);
		if (publisherBook) publisherBook.addBook(newBook);
		// Relation with Author
		if (authors.length) {
			authors.map(async (a) => {
				const authorBook = await Author.findByPk(a);
				if (authorBook) authorBook.addBook(newBook);
			});
			//Relation with Category
			if (categories.length) {
				for (const c of categories) {
					if (c !== null || c !== undefined) {          
						let categoryBook = await Category.findByPk(c);
						if (categoryBook) newBook.addCategory(categoryBook);
					}
				}
			}
			return newBook;
		}
	} catch (error) {
		console.log(error)
		return error;
	}
};

//----------- PUT -----------//
exports.modifyBook = async function(body, id) {
	const {
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
	} = body
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
		bookUpdate.rating = rating;
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
		console.log(error)
		return error;
	}
};

//----------- DELETE -----------//
exports.logicalDeleteBook = async function(id) { // switch deleting?
	try {
		const disabledBook = await Book.findByPk(id, {
		  include: [
			{ model: Category },
			{ model: Author },
			{ model: Publisher },
		  ],
		});
		if (disabledBook) {
		  const deleted = disabledBook.isActive ? false : true;
		  await disabledBook.update({ isActive: deleted });
		}		
		return disabledBook;
	} catch (error) {
		console.log(error)
		return undefined;
	}
};

//--------------------------------------------------------------------------------------------
//    DISABLE A BOOK
//--------------------------------------------------------------------------------------------
// bannedBook = async function (id) {
//   const bannedBook = await Book.findByPk(id, {
//     include: [
//       {
//         model: Category,
//       },
//       {
//         model: Author,
//       },
//       {
//         model: Publisher,
//       },
//     ],
//   });
//   if (bannedBook) {
//     const banned = bannedBook.isBanned === false ? true : false;
//     await bannedBook.update({ isBanned: banned });
//     return bannedBook;
//   }
//   return undefined;
// };