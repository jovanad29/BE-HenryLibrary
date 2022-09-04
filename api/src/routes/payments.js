//definir la ruta de la api hacia el controlador de payment
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de payment
const {
    getByUserIdStatusId, postByUserId
} = require('../controllers/payments');

// definir los metodos de la ruta de la api hacia el controlador de payment
router.get('/:userUid/:statusId', getByUserIdStatusId);
router.post('/:userUid', postByUserId);

//exportar el router para poder usarlo en el index.js
module.exports = router;