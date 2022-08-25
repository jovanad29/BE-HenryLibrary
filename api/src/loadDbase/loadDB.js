const axios = require("axios");
const { cls } = require("sequelize");
const Sequelize = require("sequelize");
const { name } = require("../app");
const Op = Sequelize.Op;
const {
    Apibook,
    Book,
    Author,
    Category,
    Review,
    Publisher,
} = require("../db.js");
const url = require("url");
const https = require("https");
// const sizeOf = require("image-size");

// const { imageRegex } = require('../utils/validations/regex');
// const { imgVerify } = require('./BooksWithLargeImage');

const maxResults = 40;
const term = [
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
    let isbn = "";

    if (industryID && industryID.length > 1) {
        if (industryID[0].type.includes("10")) {
            isbn = industryID[0].identifier;
        } else if (industryID[1].type.includes("10")) {
            isbn = industryID[1].identifier;
        }
    }
    if (isbn) {
        return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01._SX180_SCLZZZZZZZ_.jpg`;
    } else
        return "https://images-na.ssl-images-amazon.com/images/P/0345247868.01._SX180_SCLZZZZZZZ_.jpg";
}

//-----------------------------------------------------------------------------------------
//                                  GET API BOOKS
//-----------------------------------------------------------------------------------------
async function fillApi() {
    try {
        for (let i = 0; i < term.length; i++) {
            for (let j = 0; j < 1; j++) {
                let api = (
                    await axios.get(
                        `https://www.googleapis.com/books/v1/volumes?q=${
                            term[i]
                        }&printType=books&maxResults=${maxResults}&startIndex=${
                            j * 40
                        }
          `
                        //&startIndex=${i * 40}
                    )
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
                                await Apibook.findOrCreate({
                                    where: {
                                        title: b.volumeInfo.title,
                                        description: b.volumeInfo.description
                                            ? b.volumeInfo.description
                                            : "No description",
                                        price: b.saleInfo.listPrice
                                            ? b.saleInfo.listPrice.amount
                                            : (Math.random() * 100).toFixed(2),

                                        image: img,
                                        authors: b.volumeInfo.authors
                                            ? b.volumeInfo.authors
                                            : [],
                                        categories: b.volumeInfo.categories
                                            ? b.volumeInfo.categories
                                            : [],
                                        publisher: b.volumeInfo.publisher
                                            ? b.volumeInfo.publisher
                                            : "NO PUBLISHER",
                                        publishedDate: b.volumeInfo
                                            .publishedDate
                                            ? b.volumeInfo.publishedDate
                                            : "NO DATE",
                                        pageCount: b.volumeInfo.pageCount
                                            ? b.volumeInfo.pageCount
                                            : 0,
                                        rating: 0,
                                        language: b.volumeInfo.language
                                            ? b.volumeInfo.language
                                            : "NO INFO",
                                    },
                                });
                            }
                        }
                    });
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

//-----------------------------------------------------------------------------------------
//                                  LOAD CATEGORIES
//-----------------------------------------------------------------------------------------
async function fillCategories() {
    const categoriesArray = [];
    const books = await Apibook.findAll();
    const categories = books.map((a) => a.dataValues.categories);
    for (let i = 0; i < categories.length; i++) {
        categories.map((category) => {
            category.map((c) =>
                !categoriesArray.includes(
                    c.charAt(0).toUpperCase() + c.toLowerCase().slice(1)
                )
                    ? categoriesArray.push(
                          c.charAt(0).toUpperCase() + c.toLowerCase().slice(1)
                      )
                    : null
            );
        });
    }
    if (categoriesArray.length === 0) {
        return undefined;
    }
    categoriesArray.map((c) => Category.create({ name: c }));
}

//-----------------------------------------------------------------------------------------
//                                  LOAD Author
//-----------------------------------------------------------------------------------------

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
    if (authorsArray.length === 0) {
        return undefined;
    }

    authorsArray.map((a) => Author.create({ name: a }));
}

//-----------------------------------------------------------------------------------------
//                                  LOAD Publisher
//-----------------------------------------------------------------------------------------
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
    if (publisherArray.length === 0) {
        return undefined;
    }

    publisherArray.map((a) => Publisher.create({ name: a }));
}
//-----------------------------------------------------------------------------------------
//                                  LOAD Book
//-----------------------------------------------------------------------------------------

// async function imgVerify(img) {
//     //console.log(img);
//     // const imgUrl =
//     //   'https://images-na.ssl-images-amazon.com/images/P/0345247868.01._SX180_SCLZZZZZZZ_.jpg';
//     const options = url.parse(img);
//     return new Promise((resolve, reject) => {
//         https.get(options, function (response) {
//             const chunks = [];
//             let imgSize;
//             response
//                 .on("data", function (chunk) {
//                     chunks.push(chunk);
//                 })

//                 .on("end", function () {
//                     const buffer = Buffer.concat(chunks);
//                     imgSize = sizeOf(buffer);

//                     resolve(imgSize);
//                 });
//         });
//     });
// }
async function fillBook() {
    try {
        let books = await Apibook.findAll();

        for (const b of books) {
            let newBook = await Book.findOrCreate({
                where: {
                    title: b.title,
                    description: b.description
                        ? b.description
                        : "No description",
                    price: b.price,
                    image: b.image,
                    //idpublisher:,// b.publisher ? b.publisher : 'NO PUBLISHER', Falta!!
                    publishedDate: b.publishedDate
                        ? b.publishedDate
                        : "NO DATE",
                    pageCount: b.pageCount ? b.pageCount : 0,
                    rating: 0,
                    language: b.language ? b.language : "NO INFO",
                },
            });

            // Relation with Author

            if (b.authors.length > 1) {
                for (const a of b.authors) {
                    console.log(a);
                    if (a !== null || a !== undefined) {
                        let authorBook = await Author.findOne({
                            where: { name: a },
                        });
                        console.log(authorBook);
                        console.log(newBook);
                        await newBook.addAuthor(authorBook);
                    }
                }
            }

            //Relation with Category

            // if (b.categories.length) {
            //   for (const c of b.categories) {
            //     if (c !== null || c !== undefined) {
            //       let categoryBook = await Category.findOne({ where: { name: c } });
            //       await newBook.addCategory(categoryBook);
            //     }
            //   }
            // }
        }
        // }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    fillApi,
    fillCategories,
    fillAuthors,
    fillPublisher,
    fillBook,
};
