//definir la ruta de la api hacia el controlador de categorias
const { Router } = require('express');
const router = Router();
const {
    getAll,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categories');


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let dbCategory = await getById(id);
        dbCategory
            ? res.json(dbCategory)
            : res.status(404).json({ message: 'No se encontró la categoría' });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});
router.get('/', async (req, res) => {
    try {
        let dbCategories = await getAll();
        dbCategories
            ? res.json(dbCategories)
            : res.status(404).json({ message: 'No se encontraron categorías' });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        let dbCategory = await createCategory(name);
        dbCategory
            ? res.json(dbCategory)
            : res.status(404).json({ message: 'No se creó la categoría' });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});
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
