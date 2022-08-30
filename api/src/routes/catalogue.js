//definir la ruta de la api hacia el controlador de catalogo
const { Router } = require('express');
const router = Router();
const {
    getAll,
    getBook,
    getById,
    createBook,
    updateBook,
    // getBookByAuthor,
    // getBookByCategory,
    logicalDeleteBook,
    // bannedBook,
    // getCountBooks,,
    getBookQty
} = require('../controllers/catalogue');


router.get('/', async (req, res) => {
    const { title } = req.query;
    const { pagina = 0, items = 10 } = req.query;
    try {
        if (title) {
            let book = await getBook(title, pagina, items);
            book.length
                ? res.status(200).json(book)
                : res.status(404).json({message: 'No se encontró el libro'});
            } else {
                let dbBooks = await getAll(pagina, items);
                dbBooks.length
                ? res.json(dbBooks)
                : res.status(404).json({message: 'No se encontraron libros'});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
router.get('/:id', getById);
//filter by author
// router.get('/author/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         if (id) {
//             let book = await getBookByAuthor(id);
//             book
//                 ? res.status(200).json(book)
//                 : res.status(501).json({
//                     message: 'No se encontraron libros para ese author',
//                   });
//         } else {
//             let dbBooks = await getAll();
//             dbBooks
//                 ? res.json(dbBooks)
//                 : res.status(404).json({ message: 'No se encontraron libros' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(502).json(err);
//     }
// });
//count all books
router.get('/count/:true', getBookQty);
//filter by category
// router.get('/category/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         if (id) {
//             let book = await getBookByCategory(id);
//             book
//                 ? res.status(200).json(book)
//                 : res.status(501).json({
//                       message: 'No se encontraron libros para ese género',
//                   });
//         } else {
//             let dbBooks = await getAll();
//             dbBooks
//                 ? res.json(dbBooks)
//                 : res.status(404).json({ message: 'No se encontraron libros' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(502).json(err);
//     }
// });
//create book
router.post('/', createBook);
// Update book
router.put('/:id', updateBook);
//logical delete
router.delete('/:id', logicalDeleteBook);

//banned book
// router.put('/banned/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         if (id) {
//             let book = await bannedBook(id);
//             book
//                 ? res.status(200).json(book)
//                 : res.status(404).json({
//                       message: 'No se encontro el libro a dehabilitar',
//                   });
//         } else {
//             let dbBooks = await getAll();
//             dbBooks
//                 ? res.json(dbBooks)
//                 : res
//                       .status(501)
//                       .json({ message: 'No se ingreso el id para eliminar' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(502).json(err);
//     }
// });

//exportar el router para poder usarlo en el index.js
module.exports = router;
