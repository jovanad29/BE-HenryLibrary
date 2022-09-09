//definir la ruta de la api hacia el controlador de review
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de review
const { getAll, getAllReviewsByBook, createReviewByBook, editReview, deleteReview, } = require('../controllers/reviews');


// definir los metodos de la ruta de la api hacia el controlador de review
router.get('/', getAll);


router.put("/", editReview)

router.delete("/:id", deleteReview)




router.get('/byBook/:id', getAllReviewsByBook);

router.post("/byBook/:id", createReviewByBook)


//exportar el router para poder usarlo en el index.js
module.exports = router;
