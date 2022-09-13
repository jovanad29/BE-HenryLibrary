//definir la ruta de la api hacia el controlador de review
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de review
const { getAll, getAllReviewsByBook, getAllReviewByUser, createReviewByBook, editReview, deleteReview, } = require('../controllers/reviews');


// definir los metodos de la ruta de la api hacia el controlador de review
// router.get('/', getAll);

router.get('/:id', getAllReviewsByBook); //Obtener todos los reviews de un determinado libro

router.delete("/:id", deleteReview)

router.post("/byBook/:id", createReviewByBook)

router.get("/", getAllReviewByUser);  //Obtener todos los reviews de un determinado usuario

router.put("/", editReview)

//exportar el router para poder usarlo en el index.js
module.exports = router;
