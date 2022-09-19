//definir la ruta de la api hacia el controlador de categorias
const { Router } = require('express');
const router = Router();
const {
    getAll,
    getById,
    getBooksByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    bestSellerCategories
} = require('../controllers/categories');


router.get('/', (req, res) => {
    const bestseller = req.query.bestseller || false
    if (bestseller) return bestSellerCategories(req, res)
    return getAll(req, res)
});
router.get('/:id', getById);
router.get('/:id/books', getBooksByCategory)
router.get('')
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

//exportar el router para poder usarlo en el index.js
module.exports = router;
