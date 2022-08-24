
const { Router } = require('express');
const router = Router();

router.use("/catalog", require("./catalog"));
router.use("/authors", require("./authors"));
router.use("/categories", require("./categories"));
router.get('/',(req,res) => res.send("Bienvenido al backend de este precioso proyecto!"));

module.exports = router;