//definir la ruta de la api hacia el controlador de payment
const { Router } = require('express');
require('dotenv').config();
const router = Router();
const { MP_TOKEN } = process.env;
const mercadopago = require('mercadopago');
mercadopago.configure({
  access_token: MP_TOKEN,
});
//const { deleteCart } = require('../controllers/CartControllers'); HACER!!!!  CAMBIO ESTADO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const {
  createPayments,
  getPayments,
  getPaymentByID,
} = require('../controllers/paymentOrder')
//const { isSuspended } = require('../controllers/UsersControllers');HACER!!!

router.post('/', async (req, res) => {
  const { base_url, id } = req.body; // id es el id del usuario en firebase
  console.log("estoy en /payments", req.body)
  console.log("base_url", base_url)
  const verifyEnabledUser =true // await isSuspended(ID); Hacerr!!
    try {
      mercadopago.preferences
        .create({
          items: req.body.items,
          back_urls: {
            success: `${base_url}checkout/validate`,
            failure: `${base_url}checkout/validate`,
            pending: `${base_url}checkout/validate`,
          },
        })
        .then((preference) => {
          console.log("estoy en /payments imprimiendo la respuesta de mercado pago: ", preference)
          return res.json({ preferenceId: preference.body.id });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'User does not exist...' }); // ?
    }
});
router.post('/create', async (req, res) => { // crea el pago en la BD más no lo devuelve
  const { userID, items, total, ID, status ,status_detail} = req.body;
  console.log("estoy en /payments/create", req.body)
  try {
    await createPayments(req.body);   
   // items.length > 1 ? await deleteCart(userID) : null; //  Aqui tengo que actualizar el estado de CARTS!!!!!
   // emails
   //   ? res.json({ message: 'eBook email sent' })
   //   : res.status(404).json({ message: 'Cannot send eBook' });
   // await orderEmail(userID, items, total, ID);  //VER tema del mail!!!
   //let emails = await eBookEmail(userID, items);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Cannot create payment' });
  }
});
router.get('/', async (req, res) => {
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
