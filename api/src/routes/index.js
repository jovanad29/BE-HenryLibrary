
const { Router } = require('express');
const router = Router();

router.get('/',(req,res) => res.send("Bienvenido al backend de este precioso proyecto!"))

module.exports = router;
