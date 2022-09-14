const { Payment_mp, User, Book } = require('../db');
const jwt = require('jsonwebtoken');
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
    console.log("entré en create payments")
    const payment = req.body // lo que tiene order en el store
    const status = {'approved': 4, 'rejected': 7} // para evitar enviar los ids por url
    const methods = {'account_money': 2, 'credit_card': 3} // para evitar enviar los ids por url
    try {
        console.log("estoy por crear el pago")
        const newPaymentMP = await Payment_mp.create({
            transactionId: payment.transactionId,
            paymentType: payment.paymentType,
            total: payment.total,
            statusDetail: payment.statusDetail,
            deliveryAddress: payment.deliveryAddress
        })
        await newPaymentMP.setPayment_status(status[payment.status]) // transformar string a id
        await newPaymentMP.setUser(payment.userID)
        console.log(`payment method: ${payment.paymentMethod} y su id: ${methods[payment.paymentMethodId]}`)
        await newPaymentMP.setPayment_method(methods[payment.paymentMethodId]) // transformar string a id
        console.log("seteé el método de pago")
        payment.items.forEach( async i => {
            try {
                await newPaymentMP.addBook(i.bookId)
                console.log("actualicé? ", await payment_mp_book.update({
                    quantity: parseInt(i.quantity),
                    price: parseFloat(i.price)
                },
                {
                    where: {
                        bookId: i.bookId,
                        paymentMpId: newPaymentMP.id
                    }
                }))
                console.log("agregué el libro")
                const book = await Book.findByPk(i.bookId)
                await book.update({
                    soldCopies: book.soldCopies + parseInt(i.quantity),
                    currentStock: book.currentStock - parseInt(i.quantity)
                });
            } catch (error) {
                console.log(error)
            }
        });
        /*
        "items": [
            {
                "category_id": null,
                "description": null,
                "id": "61",
                "picture_url": "https://images-na.ssl-images-amazon.com/images/P/8498382688.01._PE99_SCLZZZZZZZ_.jpg",
                "quantity": "1",
                "title": "ANIMALES FANTASTICOS Y DONDE ENCONTRARLOS",
                "unit_price": "466.1000061035156"
            },
            {
                "category_id": null,
                "description": null,
                "id": "59",
                "picture_url": "https://images-na.ssl-images-amazon.com/images/P/8498387906.01._PE99_SCLZZZZZZZ_.jpg",
                "quantity": "1",
                "title": "Animales Fantásticos Y Dónde Encontrarlos Fantastic Beasts and Where to Find Them",
                "unit_price": "823.2000122070312"
            }
        ]
        */
        return res.status(201).json(newPaymentMP)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
    // try {
    //     console.log("Estoy en el controlador 'createPayments' imprimiendo el param recibido: ", payment)
    //     const createPayment = await PaymentsOrder.create({
    //         mpID: payment.ID, // transactionId
    //         items: payment.items, // payment_mp_book ( cada row de estos items es un registro en la tabla)
    //         total: payment.total,
    //         userID: payment.userID, // relación con tabla user
    //         status: payment.status, // relación con tabla payment_satus
    //     });
    //     const categoriesArray = await createPayment.toJSON().items;
    //     console.log("estoy imprimiendo createPayment en el controlador createPayments: ", createPayment)
    //     console.log("estoy imprimiendo categoriesArray en el controlador createPayments: ", categoriesArray)
    //     for (let i = 0; i < categoriesArray.length; i++) {
    //         const ID = await createPayment.toJSON().items[i].ID;
    //         const book = await Book.findByPk(ID);
    //         const bookJSON = book.toJSON();

    //     await book.update({
    //         soldCopies: bookJSON.soldCopies + 1, // y si compré el mismo libro más de una vez?
    //     });

    //     // cargar las copias vendidas por CATEGORIA podriamos hacerlo !!!  
    //     // const cat = await Category.findOne({
    //     //     where: {
    //     //       category: { [Op.iLike]: bookJSON.categories[0] },
    //     //     },
    //     //   });

    //     //   let soldCopy = 0;
    //     //   if (cat) {
    //     //     soldCopy = cat.toJSON().soldCopies;
    //     //     await cat.update({
    //     //       soldCopies: soldCopy + 1,
    //     //     });
    //     //   }
    //     } // fin del for
    //     console.log(createPayment)
    //     // return res.json(createPayment);
    // } catch (error) {
    //     console.log(error)
    //     // return res.status(500).json(error)
    // }
}
   
exports.getPayments = async function () {
       const payments = await PaymentsOrder.findAll({
         include: {
           model: User,        
         },
       });
       return payments;
     },
   
exports.getPaymentByID = async function (ID, token) {
       const userToken = jwt.decode(token, process.env.PASS_TOKEN);
       if (userToken) {
         const user = Users.findByPk(userToken.ID);
         if (user) {
           const payment = await Payments.findByPk(ID);
           if (payment) return payment;
         }
       } else {
         const payment = await PaymentsOrder.findByPk(ID, { include: User });
         return payment;
       }
       return undefined;
     }
//    };
   
//    module.exports = paymentsModel;
   