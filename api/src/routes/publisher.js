//definir la ruta de la api hacia el controlador de publisher
const { Router } = require('express');
const { getAll, getById } = require('../controllers/publisher');
const router = Router();
// requerir los metodos del controlador de publisher

// definir los metodos de la ruta de la api hacia el controlador de publisher
router.get('/', getAll);
router.get('/:id', getById);


//exportar el router para poder usarlo en el index.js
module.exports = router;
