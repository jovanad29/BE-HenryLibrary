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
} = require('../controllers/categories');


router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/books', getBooksByCategory)
router.post('/', createCategory);
router.put('/:id', async (req, res) => { 
    const { id } = req.params;
    const { name } = req.body;
    try {
        let dbCategory = await updateCategory(id, name);
        dbCategory
            ? res.json(dbCategory)
            : res.status(404).json({ message: 'No se actualizó la categoría' });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let dbCategory = await deleteCategory(id);
        dbCategory
            ? res.json(dbCategory)
            : res.status(404).json({ message: 'No se eliminó la categoría' });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});

//exportar el router para poder usarlo en el index.js
module.exports = router;
