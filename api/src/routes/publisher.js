//definir la ruta de la api hacia el controlador de publisher
const { Router } = require('express');
const router = Router();
// requerir los metodos del controlador de publisher

// definir los metodos de la ruta de la api hacia el controlador de publisher
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            let publisher = await getById(id);
            publisher
                ? res.status(200).json(publisher)
                : res.status(501).json({ message: 'No se encontro el publisher' }); 
        } else {
            res.status(502).json({ message: 'No se ingreso el ID de publisher' });
        }   
    } catch (err) {
        console.log(err);
        res.status(503).json(err);//si hay un error, se envia el error en formato json  
    }
} );
// ----------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    try {
        let dbPublishers = await getAll();
        dbPublishers
            ? res.status(200).json(dbPublishers)
            : res.status(501).json({ message: 'No se encontraron publishers' });
    } catch (err) {
        console.log(err);
        res.status(502).json(err);//si hay un error, se envia el error en formato json         
    }
} );

//exportar el router para poder usarlo en el index.js
module.exports = router;
