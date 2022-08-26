//definir la ruta de la api hacia el controlador de user
const { Router } = require('express');
const router = Router();
// const {getAll,getById,createAuthor,updateAuthor,deleteAuthor} = require('../controllers/authors');

// router.get('/:id', getById);
// router.get('/', getAll);
// router.post('/', createAuthor);
// router.put('/:id', updateAuthor);
// router.delete('/:id', deleteAuthor);

//exportar el router para poder usarlo en el index.js
module.exports = router;