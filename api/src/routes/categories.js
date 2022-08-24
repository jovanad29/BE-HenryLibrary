//definir la ruta de la api hacia el controlador de categorias  
const { Router } = require('express');
const router = Router();
const {getAll,getById,createCategory,updateCategory,deleteCategory} = require('../controllers/categories');

router.get('/:id', getById);
router.get('/', getAll);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

//exportar el router para poder usarlo en el index.js
module.exports = router;