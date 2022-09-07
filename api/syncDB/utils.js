require('dotenv').config();
const axios = require("axios");
const { Apibook, Book, Author, Category, Publisher } = require("../src/db");
const url = require("url");
const https = require("https");
const sizeOf = require("image-size");


const maxResults = 10; // per page
const term = [         // for searching volumes
  "harry potter y",
  "harry potter and",
  "el principito",
  "el señor de los anillos",
  "lord of the rings",
  "increibles",
  "grandes",
  "javascript",
  "fantasticos",
  "comic",
  "locos",
  "sherlock holmes",
  "ethereum",
  "deep web",
  "shakespeare",
];

async function getImage(industryID) {
	let isbn = ""
	if (industryID && industryID.length > 1) {
		if (industryID[0].type.includes("10")) {
			isbn = industryID[0].identifier
		} else if (industryID[1].type.includes("10")) {
			isbn = industryID[1].identifier
		}
	}
	if (isbn) {
		return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01._SX180_SCLZZZZZZZ_.jpg`;
	} else {
		return "https://images-na.ssl-images-amazon.com/images/P/0345247868.01._SX180_SCLZZZZZZZ_.jpg";
	}
}

// Pide los libros de la API y llena la tabla intermedia Apibooks
async function fillApi() {
  const URL = 'https://www.googleapis.com/books/v1/volumes?'
  try {
    for (let i = 0; i < term.length; i++) {
      for (let j = 0; j < 1; j++) {
        let api = (
          await axios.get(`${URL}q=${term[i]}&printType=books&maxResults=${maxResults}&startIndex=${j*40}`)
        ).data;

        api.items &&
          api.items.map(async (b) => {
            const industryID = b.volumeInfo.industryIdentifiers
              ? b.volumeInfo.industryIdentifiers
              : [];
            const img = await getImage(
              industryID.length > 0 ? industryID : null
            );
            if (b.volumeInfo.title && b.volumeInfo.description) {
              if (
                b.volumeInfo.title.length < 10000 &&
                b.volumeInfo.description.length < 10000
              ) {
                await Apibook.findOrCreate({ // si el libro no existe, lo registra
                  where: {
                    title: b.volumeInfo.title,
                    description: b.volumeInfo.description
                      ? b.volumeInfo.description
                      : "NO DESCRIPTION AVAILABLE",
                    price: b.saleInfo.listPrice
                      ? b.saleInfo.listPrice.amount
                      : (Math.random() * 100).toFixed(2),

                    image: img,
                    authors: b.volumeInfo.authors ? b.volumeInfo.authors : [],
                    categories: b.volumeInfo.categories
                      ? b.volumeInfo.categories
                      : [],
                    publisher: b.volumeInfo.publisher
                      ? b.volumeInfo.publisher
                      : "NO PUBLISHER AVAILABLE",
                    publishedDate: b.volumeInfo.publishedDate
                      ? b.volumeInfo.publishedDate
                      : "NO DATE AVAILABLE",
                    pageCount: b.volumeInfo.pageCount
                      ? b.volumeInfo.pageCount
                      : 0,
                    rating: 0,
                    language: b.volumeInfo.language
                      ? b.volumeInfo.language
                      : "NO LANGUAGE AVAILABLE",
                  },
                });
              }
            }
          });
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// Carga las categorías registradas en Apibook a la tabla category
async function fillCategories() {
    const categoriesArray = [];
    const books = await Apibook.findAll();
    const categories = books.map((a) => a.dataValues.categories);
    for (let i = 0; i < categories.length; i++) {
        categories.map((category) => {
            category.map((c) =>
            !categoriesArray.includes(c.trim()) ? categoriesArray.push(c.trim()) : null
            );
        });
    }
    if (!categoriesArray.length) {
        return undefined;
    }
    categoriesArray.map((c) => Category.create({ name: c }));
}

// Carga los autores registradas en Apibook a la tabla author
async function fillAuthors() {
    const authorsArray = [];
    const books = await Apibook.findAll();
    const authors = books.map((a) => a.dataValues.authors);
    for (let i = 0; i < authors.length; i++) {
        authors.map((author) => {
            author.map((a) =>
                !authorsArray.includes(a) ? authorsArray.push(a) : null
            );
        });
    }
    if (!authorsArray.length) {
        return undefined;
    }
    authorsArray.map((a) => Author.create({ name: a }));
}

// Carga las editoriales registradas en Apibook a la tabla publisher
async function fillPublisher() {
    const publisherArray = [];
    const books = await Apibook.findAll();
    const publishers = books.map((a) => a.dataValues.publisher);
    for (let i = 0; i < publishers.length; i++) {
        publishers.map((publisher) => {
            !publisherArray.includes(publisher)
            ? publisherArray.push(publisher)
            : null;
        });
    }
    if (!publisherArray.length) {
        return undefined;
    }
    publisherArray.map((a) => Publisher.create({ name: a }));
}

// Verifica que la url de la imagen tenga el formato y tamaño correctos
async function imgVerify(img) {
    // const imgUrl = 'https://images-na.ssl-images-amazon.com/images/P/0345247868.01._SX180_SCLZZZZZZZ_.jpg';
	// console.log(img)
    const options = url.parse(img);
    return new Promise((resolve, reject) => {
        https.get(options, function (response) {
            const chunks = [];
            let imgSize;
            response
            .on("data", function (chunk) {
                chunks.push(chunk);
            })
            .on("end", function () {
                const buffer = Buffer.concat(chunks);
                imgSize = sizeOf(buffer);
                resolve(imgSize);
            });
        });
    });
}

// Carga los libros registrados en Apibook en la tabla book y crea las relaciones correspondientes
async function fillBook() {
	try {
		let books = await Apibook.findAll();
		for (let i = 0; i < books.length; i++) {
			const book = books[i]
			if (!book) continue
				// booksArray.push(book);
			let publisherBook = await Publisher.findOne({where: { name: book.dataValues.publisher }});
			const newBook = await Book.findOrCreate({
				where: {
					title: book.dataValues.title,
					description: book.dataValues.description ? book.dataValues.description : "NO DESCRIPTION",
					price: book.dataValues.price ? (book.dataValues.price *10).toFixed(2): (Math.random()*100).toFixed(2),
					image: book.dataValues.image,
					publisherId: publisherBook ? publisherBook.dataValues.id : null,
					publishedDate: book.dataValues.publishedDate ? book.dataValues.publishedDate : "NO DATE",
					pageCount: book.dataValues.pageCount ? book.dataValues.pageCount : 0,
					rating: (Math.random(100)*10).toFixed(2),
          soldCopies:(Math.random(10000)*100),
					language: book.dataValues.language ? book.dataValues.language : "NO INFO",
					currentStock: (Math.random(100)*100),
				}
			});
			// Relacionar editorial
			if (publisherBook) publisherBook.addBook(newBook[0])
			// Relacionar autor/es
			book.dataValues.authors.map(async (a) => {
				const authorBook = await Author.findOne({where: { name: a.trim() }});
				if (authorBook) authorBook.addBook(newBook[0]);
			});
			// Relacionar con categoría/s
			if (book.dataValues.categories.length) {
				for (const c of book.dataValues.categories) {
					if (c !== null || c !== undefined) {
						let categoryBook = await Category.findOne({ where: { name: c.trim() } });
						if (categoryBook) newBook[0].addCategory(categoryBook);
					}
				}
			}
		}
	} catch (error) {
		console.log(error)
	}    
    return 'Done'
}

module.exports = {
  fillApi,
  fillCategories,
  fillAuthors,
  fillPublisher,
  fillBook,
};
