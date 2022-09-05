//definir la ruta de la api hacia el controlador de payment
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de payment
const {
    getPaymentPaymentBook, getAllByUserId, postByUserId, putAllByUserId, putAllById, postPaymentPaymentBook
} = require('../controllers/payments');

// definir los metodos de la ruta de la api hacia el controlador de payment
router.get('/:userUid', getPaymentPaymentBook);
router.get('/all/:userUid', getAllByUserId);
router.post('/:userUid', postByUserId);
router.put('/id/:id', putAllById);
router.put('/:userUid', putAllByUserId);
router.post('/mergecart/:userUid', postPaymentPaymentBook);


//exportar el router para poder usarlo en el index.js
module.exports = router;