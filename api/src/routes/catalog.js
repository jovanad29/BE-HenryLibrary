//definir la ruta de la api hacia el controlador de catalogo
const { Router } = require('express');  
const router = Router();
const {getAll,getBook,getById,createBook,
  updateBook, getBookByAuthor, getBookByCategory,
   logicalDeleteBook} = require('../controllers/catalog');

router.get('/:id', async (req,res) => {
    const book = await getById(req.params.id);
    try {
      if(book){
          res.status(200).json(book);
      }else{
          res.status(501).json({message: 'No se encontro el libro'});
      }
    } catch (error) {
        res.status(502).json(error);
    }
} );


router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
      if (title) {
        let book = await getBook(title);
        book
          ? res.status(200).json(book)
          : res.status(501).json({ message: 'No se encontro el libro' });
      } else {
        let dbBooks = await getAll();
        dbBooks
          ? res.json(dbBooks)
          : res.status(501).json({ message: 'No se encontraron libros' });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json(err);
    }
  });

//filter by author
router.get('/author/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      let book = await getBookByAuthor(id);
      book
        ? res.status(200).json(book)
        : res.status(501).json({ message: 'No se encontraron libros para ese author' });
    } else {
      let dbBooks = await getAll();
      dbBooks
        ? res.json(dbBooks)
        : res.status(404).json({ message: 'No se encontraron libros' });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json(err);
  }
});

//filter by category
router.get('/category/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      let book = await getBookByCategory(id);
      book
        ? res.status(200).json(book)
        : res.status(501).json({ message: 'No se encontraron libros para ese género' });
    } else {
      let dbBooks = await getAll();
      dbBooks
        ? res.json(dbBooks)
        : res.status(404).json({ message: 'No se encontraron libros' });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json(err);
  }
});


router.post('/', createBook);
router.put('/:id', updateBook);
//logical delete 

router.put('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      let book = await logicalDeleteBook(id);
      book
        ? res.status(200).json(book)
        : res.status(404).json({ message: 'No se encontro el libro a eliminar' });
    } else {
      let dbBooks = await getAll();
      dbBooks
        ? res.json(dbBooks)
        : res.status(501).json({ message: 'No se ingreso el id para eliminar' });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json(err);
  }
});

//exportar el router para poder usarlo en el index.js
module.exports = router;
