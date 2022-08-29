
const { Router } = require('express');
const router = Router();


router.get('/',(req,res) => res.send('Bienvenido al backend de este precioso proyecto!'));
router.use('/catalogue', require('./catalogue'));
router.use('/authors', require('./authors'));
router.use('/categories', require('./categories'));
router.use('/user', require('./user'));
router.use('/reviews', require('./reviews'));
router.use('/payment', require('./payment'));
router.use('/publisher', require('./publisher'));
router.use('/paymentMethod', require('./paymentMethod'));

module.exports = router;
