//definir la ruta de la api hacia el controlador de payment
const { Router } = require('express');
require('dotenv').config();
const router = Router();


const {
  createPayments,
  getPayments,
  getPaymentByID,
  setMercadoPago
} = require('../controllers/paymentMP')
//const { isSuspended } = require('../controllers/UsersControllers');HACER!!!

router.post('/', setMercadoPago)
router.post('/create', createPayments)
router.get('/', async (req, res) => {
  console.log("estoy en paymentOrders")
  try {
    const payments = await getPayments();
    payments
      ? res.json({ data: payments, message: 'Success' })
      : res.status(404).json({ message: 'No payments...' });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Cannot get payment' });
  }
});

router.get('/:id', async (req, res) => {
  const { ID } = req.params;
  const { token } = req.query;
  try {
    const payment = await getPaymentByID( ID , token);

    payment
      ? res.json({ data: payment, message: 'Success' })
      : res.status(404).json({ message: `No payment with ID ${ID}...` });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Cannot get payment' });
  }
});

module.exports = router;