//definir la ruta de la api hacia el controlador de review
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de review
const { getAll, createReview, editReview, deleteReview } = require('../controllers/reviews');


// definir los metodos de la ruta de la api hacia el controlador de review
router.get('/', getAll);

router.post("/", createReview)

router.put("/", editReview)

router.delete("/:id", deleteReview)

//exportar el router para poder usarlo en el index.js
module.exports = router;
