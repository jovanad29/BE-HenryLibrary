const { Payment_mp, User, Book, payment_mp_book } = require('../db');
const jwt = require('jsonwebtoken');
const { getTemplate, sendEmail } = require('../config/nodemailer.config');
require('dotenv').config();
const { MP_TOKEN } = process.env;
const mercadopago = require('mercadopago');
mercadopago.configure({ access_token: MP_TOKEN });

exports.setMercadoPago = async (req, res) => { // solo crea el preferenceID y los backurls en MercadoPago.jsx
    const { base_url, items, uid } = req.body; // id es el id del usuario en firebase que se usa para validar que puede entrar
                                       // pero parece ya no ser necesario (solo el base_url e items)
    try {
        const { body } = await mercadopago.preferences
        .create(
            {
                items: items,
                back_urls: {
                    success: `${base_url}checkout/validate`,
                    failure: `${base_url}checkout/validate`,
                    pending: `${base_url}checkout/validate`,
                },
            }
        )
        return res.status(201).json({ preferenceId: body.id });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
   
//    let paymentsModel = {
exports.createPayments = async (req, res) => {
    const payment = req.body // lo que tiene order en el store
    const status = {'approved': 4, 'rejected': 7} // para evitar enviar los ids por url
    const methods = {'account_money': 2, 'credit_card': 3} // para evitar enviar los ids por url
    try {
        const newPaymentMP = await Payment_mp.create({
            transactionId: payment.transactionId,
            paymentType: payment.paymentType,
            total: payment.total,
            statusDetail: payment.statusDetail,
            deliveryAddress: payment.deliveryAddress
        })
        payment.items.forEach( async i => {
            try {
                await newPaymentMP.addBook(i.bookId)
                await payment_mp_book.update({
                    quantity: parseInt(i.quantity),
                    price: parseFloat(i.price)
                },
                {
                    where: {
                        bookId: i.bookId,
                        paymentMpId: newPaymentMP.id
                    }
                })
                const book = await Book.findByPk(i.bookId)
                await book.update({
                    soldCopies: book.soldCopies + parseInt(i.quantity),
                    currentStock: book.currentStock - parseInt(i.quantity)
                });
            } catch (error) {
                console.log(error)
            }
        })
        try {
            await newPaymentMP.setPayment_status(status[payment.status]) // transformar string a id
            await newPaymentMP.setUser(payment.userID)
            await newPaymentMP.setPayment_method(methods[payment.paymentMethodId]) // transformar string a id
        } catch (error) {
            console.log(error)
        }
        const association = await Payment_mp.findByPk(newPaymentMP.id, {include: [{ model: Book }]} )
        const user = await newPaymentMP.getUser()
        const html = getTemplate('purchaseReceipt', body={user,association})
        await sendEmail(user.email, 'Recibo de Pago - Librería Henry', html);
        return res.status(201).json(newPaymentMP)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
   
// exports.getPayments = async function () {
//     const payments = await PaymentsOrder.findAll({
//         include: {
//         model: User,        
//         },
//     });
//     return payments;
// }
   
// exports.getPaymentByID = async function (ID, token) {
//     const userToken = jwt.decode(token, process.env.PASS_TOKEN);
//     if (userToken) {
//         const user = User.findByPk(userToken.ID);
//         if (user) {
//         const payment = await Payment_mp.findByPk(ID);
//         if (payment) return payment;
//         }
//     } else {
//         const payment = await Payment_mp.findByPk(ID, { include: User });
//         return payment;
//     }
//     return undefined;
// }
//    };
   
//    module.exports = paymentsModel;
   