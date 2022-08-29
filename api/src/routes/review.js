//definir la ruta de la api hacia el controlador de review
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de review
const {getAll} = require('../controllers/review');
// definir los metodos de la ruta de la api hacia el controlador de review
router.get('/', async (req, res) => {   
    try {
        let dbReviews = await getAll();
        dbReviews
            ? res.status(200).json(dbReviews)
            : res.status(501).json({ message: 'No se encontraron reviews' });
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
} );


//exportar el router para poder usarlo en el index.js
module.exports = router;