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

router.post('/', setMercadoPago);
router.post('/create', createPayments) // => { // crea el pago en la BD más no lo devuelve
//   // const { userID, items, total, ID, status ,status_detail} = req.body;
//   console.log("estoy en /payments/create", req.body)
//   try {
//     console.log(await createPayments(req.body));   
//    // items.length > 1 ? await deleteCart(userID) : null; //  Aqui tengo que actualizar el estado de CARTS!!!!!
//    // emails
//    //   ? res.json({ message: 'eBook email sent' })
//    //   : res.status(404).json({ message: 'Cannot send eBook' });
//    // await orderEmail(userID, items, total, ID);  //VER tema del mail!!!
//    //let emails = await eBookEmail(userID, items);
//   } catch (err) {
//     console.log(err);
//     res.status(404).json({ message: 'Cannot create payment' });
//   }
// });
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
