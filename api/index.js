
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Apibook, Book, Category, Author } = require('./src/db');
const {LoadDB,fillCategories}=require('./src/loadDbase/loadDB');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
        server.listen(3001, async () => {
        
       
            const apiBooksDb = await Apibook.findAll();
          //  const booksDb = await Book.findAll();
            const categoriesDb = await Category.findAll();
         //   const authorsDb = await Author.findAll();
        
            if (apiBooksDb.length > 0) {
              console.log('Table ApiBooks already with books, nothing to add');
            } else {
              console.log('Filling ApiBooks table...');
              await LoadDB();
              console.log('Done');
            }
            // if (booksDb.length > 0) {
            //   console.log('Table Books already with books, nothing to add');
            // } else {
            //   console.log('Filling Books table...');
            //   await booksWithImg();
            //   console.log('Done');
           // }
            if (categoriesDb.length > 0) {
              console.log('Table Categories already with data, nothing to add');
            } else {
              console.log('Filling Categories table...');
              await fillCategories();
              console.log('Done');
            }
            // if (authorsDb.length > 0) {
            //   console.log('Table Authors already with data, nothing to add');
            // } else {
            //   console.log('Filling Authors table...');
            //   await fillAuthors();
            //   console.log('Done');
            // }
        
            console.log('%s listening at 3001'); // eslint-disable-line no-console
          });



       
    });
