
const { Router } = require('express');
const router = Router();

router.use("/catalog", require("./catalog"));
router.use("/authors", require("./authors"));
router.use("/categories", require("./categories"));
router.use("/user", require("./user"));
router.use("/review", require("./review"));
router.use("/payment", require("./payment"));
router.use("/publisher", require("./publisher"));
router.use("/paymentMethod", require("./paymentMethod"));


router.get('/',(req,res) => res.send("Bienvenido al backend de este precioso proyecto!"));

module.exports = router;