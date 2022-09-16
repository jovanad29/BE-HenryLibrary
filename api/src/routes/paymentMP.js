//definir la ruta de la api hacia el controlador de payment
const { Router } = require("express");
require("dotenv").config();
const router = Router();

const {
    createPayments,
    getPayments,
    getPaymentByID,
    setMercadoPago,
    getPaymentMPUserAllAdresses,
} = require("../controllers/paymentMP");
//const { isSuspended } = require('../controllers/UsersControllers');HACER!!!

router.post("/", setMercadoPago);
router.post("/create", createPayments);
router.get("/", async (req, res) => {
    console.log("estoy en paymentOrders");
    try {
        const payments = await getPayments();
        payments
            ? res.json({ data: payments, message: "Success" })
            : res.status(404).json({ message: "No payments..." });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Cannot get payment" });
    }
});

router.get("/:id", async (req, res) => {
    const { ID } = req.params;
    const { token } = req.query;
    try {
        const payment = await getPaymentByID(ID, token);

        payment
            ? res.json({ data: payment, message: "Success" })
            : res.status(404).json({ message: `No payment with ID ${ID}...` });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Cannot get payment" });
    }
});

//route for get all adresses by UserId
router.get("/adresses/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
        const addresses = await getPaymentMPUserAllAdresses(uid);

        addresses
            ? res.json(addresses)
            : res.status(404).json({ message: `No hay direcciones` });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Cannot get addresses" });
    }
});

module.exports = router;
