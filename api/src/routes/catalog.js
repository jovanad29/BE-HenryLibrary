//definir la ruta de la api hacia el controlador de catalogo
const { Router } = require('express');  
const router = Router();
const {getAll,getBook,getById,createBook,updateBook,deleteBook} = require('../controllers/catalog');

router.get('/:id', getById);
// router.get('/', catalogController.getAll);
router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
      if (title) {
        let book = await getBook(title);
        book
          ? res.json(book)
          : res.status(404).json({ message: 'No se encontro el libro' });
      } else {
        let dbBooks = await getAll();
        dbBooks
          ? res.json(dbBooks)
          : res.status(404).json({ message: 'No se encontraron libros' });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json(err);
    }
  });
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

//exportar el router para poder usarlo en el index.js
module.exports = router;
