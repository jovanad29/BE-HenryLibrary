
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Apibook, Book, Category, Author,Publisher } = require('./src/db');
const {fillApi, fillCategories, fillAuthors, fillPublisher , fillBook }=require('./src/loadDbase/loadDB');


// Syncing all the models at once.
conn.sync({ force: false}).then(() => {
        server.listen(3001, async () => {
        
       
            const apiBooksDb = await Apibook.findAll();
            const booksDb = await Book.findAll();
            const categoriesDb = await Category.findAll();
            const authorsDb = await Author.findAll();
            const publishersDb = await Publisher.findAll();
        
            if (apiBooksDb.length > 0) {
              console.log('Table ApiBooks already with books, nothing to add');
            } else {
              console.log('Filling ApiBooks table...');
              await fillApi();
              console.log('Done');
            }
           
            if (categoriesDb.length > 0) {
              console.log('Table Categories already with data, nothing to add');
            } else {
              console.log('Filling Categories table...');
              await fillCategories();
              console.log('Done');
            }
            if (authorsDb.length > 0) {
               console.log('Table Authors already with data, nothing to add');
            } else {
              console.log('Filling Authors table...');
              await fillAuthors();
              console.log('Done');
            }
            if (publishersDb.length > 0) {
              console.log('Table Publisher already with data, nothing to add');
           } else {
             console.log('Filling Publisher table...');
             await fillPublisher();
             console.log('Done');
           }
            if (booksDb.length > 0) {
              console.log('Table Books already with books, nothing to add');
            } else {
              console.log('Filling Books table...');
              await fillBook();
              console.log('Done');
           }

           
        
            console.log('%s listening at 3001'); // eslint-disable-line no-console
          });
      
    });
