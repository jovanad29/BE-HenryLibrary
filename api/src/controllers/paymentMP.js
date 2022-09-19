const { Payment_mp, User, Book, payment_mp_book, Payment_method, Payment_status, Order_status } = require("../db");
const jwt = require("jsonwebtoken");
const { getTemplate, sendEmail } = require("../config/nodemailer.config");
require("dotenv").config();
const { MP_TOKEN } = process.env;
const mercadopago = require("mercadopago");
mercadopago.configure({ access_token: MP_TOKEN });

exports.setMercadoPago = async (req, res) => {
    // solo crea el preferenceID y los backurls en MercadoPago.jsx
    const { base_url, items, uid } = req.body; // id es el id del usuario en firebase que se usa para validar que puede entrar
    // pero parece ya no ser necesario (solo el base_url e items)
    try {
        const { body } = await mercadopago.preferences.create({
            items: items,
            back_urls: {
                success: `${base_url}/checkout/validate`,
                failure: `${base_url}/checkout/validate`,
                pending: `${base_url}/checkout/validate`,
            },
        });
        return res.status(201).json({ preferenceId: body.id });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

//    let paymentsModel = {
exports.createPayments = async (req, res) => {
    const payment = req.body // lo que tiene order en el store
    const status = {'in_process': 2, 'approved': 4, 'rejected': 7} // para evitar enviar los ids por url
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
                await newPaymentMP.addBook(i.bookId);
                await payment_mp_book.update(
                    {
                        quantity: parseInt(i.quantity),
                        price: parseFloat(i.price),
                    },
                    {
                        where: {
                            bookId: i.bookId,
                            paymentMpId: newPaymentMP.id,
                        },
                    }
                );
                const book = await Book.findByPk(i.bookId);
                await book.update({
                    soldCopies: book.soldCopies + parseInt(i.quantity),
                    currentStock: book.currentStock - parseInt(i.quantity),
                });
            } catch (error) {
                console.log(error);
            }
        })
        try {
            await newPaymentMP.setPayment_status(status[payment.status]) // transformar string a id
            await newPaymentMP.setUser(payment.userID)
            await newPaymentMP.setPayment_method(methods[payment.paymentMethodId]) // transformar string a id
            await newPaymentMP.setOrder_status(1) // ESTADO DE DESPACHO
        } catch (error) {
            console.log(error)
        }
        const association = await Payment_mp.findByPk(newPaymentMP.id, {include: [{ model: Book }]} )
        const user = await newPaymentMP.getUser()
        const html = getTemplate('purchaseReceipt', body={user,association})
        await sendEmail(user.email, 'Recibo de Pago - Librería Henry', html);
        return res.status(201).json(association)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment_mp.findAll(
            {
                order: [["id", "ASC"]],
                include:[
                    {model: Book, attributes: ["id", "title", "image"] },
                    {model: User, attributes: ["uid", "nameUser", "email"] },
                    {model: Payment_status, attributes: ["id", "description"] },
                    {model: Payment_method, attributes: ["id", "descrption"]},
                    {model: Order_status, attributes: ["id", "description"]}
                ]
            })
        return res.json(payments)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error with server"})
    }
}

exports.changeOrderStatus = async (req, res) => {
    try {
        const payment = await Payment_mp.findByPk(req.params.pid)
        await payment.setOrder_status(req.params.oid)
        return res.status(204).json({})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
   
// //getAllPaymentPaymentBook
// exports.getAllPaymentPaymentBook = async function (req, res) {
//     try {
//         const payment = await Payment.findAll({
//             order: [["id", "ASC"]],
//             include: [
//                 { model: Book, attributes: ["id", "title", "image"] },
//                 { model: Payment_status, attributes: ["id", "description"] },
//             ],
//         });
//         // extraer los datos que hay en payment
//         const items = payment.map((item) => item.dataValues);
//         if (payment) return res.status(200).json(items);
//         return res.json({
//             status: 404,
//             message: "No se encontraron registros",
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// };

// exports.getPayments = async function () {
//     const payments = await Payment_mp.findAll({
//         include: {
//             model: User,
//         },
//     });
//     return payments;
// }

// exports.getPaymentByID = async function (uid) {
       
//        const payment = await Payment_mp.findByPk(uid);
//        if (payment) return payment;
      
//         return undefined;
// };

// exports.getPaymentMPUserAllAdresses = async function (uid) {
//     if (uid) {
//         const userAdresses = Payment_mp.findAll({
//             where: {
//                 userId: uid,
//             },
//             attributes: ["deliveryAddress"],
//             group: ["deliveryAddress"],
//         });
//         if (userAdresses) {
//             return userAdresses;
//         }
//     }
//     return undefined;
// };

//    };

//    module.exports = paymentsModel;
