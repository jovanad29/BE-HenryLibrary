const { Payment, payment_book, Book, Payment_status, conn, Payment_method } = require("../db");
const { Op } = require("sequelize");

// get payment y payment_book por userId con stausId=1.
exports.getPaymentPaymentBook = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.findOne({
            attributes: ["id", "userUid", "totalAmount"],
            include: [
                {
                    model: Book,
                    attributes: ["id", "title", "image"],
                    // order: [["title", "ASC"]],
                },
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
            order: [[Book, "title", "asc"]],
            where: {
                userUid: userUid,
            },
        });

        if (payment) {
            return res.status(200).json(payment);
        }
        return res.json({ status: 404, message: "No se encontró el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// get all payment/orden/carrito por userId
exports.getAllByUserId = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.findAll({
            order: [["id", "DESC"]],
            include: [
                { model: Book, attributes: ["id", "title", "image"] },
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    // no corresponde filtrar por id 1, este metodo tiene que traer todos los registros de payment para el usuario
                    // where: { id: 1 },
                },
                {
                    model: Payment_method,
                    attributes: ["id", "descrption"],
                    // no corresponde filtrar por id 1, este metodo tiene que traer todos los registros de payment para el usuario
                    // where: { id: 1 },
                },
            ],
            where: {
                userUid: userUid,
            },
        });
        // extraer los datos que hay en payment
        const items = payment.map((item) => item.dataValues);
        if (payment) return res.status(200).json(items);
        return res.json({
            status: 404,
            message: "No se encontraron registros",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//getAllPaymentPaymentBook
exports.getAllPaymentPaymentBook = async function (req, res) {
    try {
        const payment = await Payment.findAll({
            order: [["id", "ASC"]],
            include: [
                { model: Book, attributes: ["id", "title", "image"] },
                { model: Payment_status, attributes: ["id", "description"] },
            ],
        });
        // extraer los datos que hay en payment
        const items = payment.map((item) => item.dataValues);
        if (payment) return res.status(200).json(items);
        return res.json({
            status: 404,
            message: "No se encontraron registros",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//getCountPaymentBook
// get count payment_book por userId con stausId=1.
exports.getCountPaymentBook = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });
        if (payment) {
            const items = await payment_book.findAll({
                where: {
                    paymentId: payment.id,
                },
            });
            const itemsPaymentBook = items.map((item) => item.dataValues);
            // sumar la cantidad total de quantity
            let totalQuantity = 0;
            for (let i = 0; i < itemsPaymentBook.length; i++) {
                totalQuantity += itemsPaymentBook[i].quantity;
            }
            return res.status(200).json({ totalQuantity: totalQuantity });
        }

        return res.json({ status: 404, message: "No se encontró el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// //getCantItemsByCart
// exports.getCantItemsByCart = async function (req, res) {
//     const { userUid } = req.params;
//     try {
//         const payment = await Payment.findAll({
//             //include model book y los atributos cantidad de quantity de la tabla payment_book
//             attributes: ['id','userUid','statusId','totalAmount'],
//             include: [
//                 { model: Book, attributes: [ 'id','title'] },
//             ],

//         where: {
//             userUid: userUid,
//         },
//         });
//         // sumar la cantidad total de quantity que hay en payment_book
//         let totalQuantity = 0;
//         paymentJson = JSON.parse(JSON.stringify(payment,null,2));
//         // sumar la cantidad total que hay en todas las propiedades quantity de payment_book
//         for (let i = 0; i < paymentJson.length; i++) {
//             for (let j = 0; j < paymentJson[i].books.length; j++) {
//                 totalQuantity += paymentJson[i].books[j].payment_book.quantity;
//             }
//         }

//         if (payment) return res.status(200).json({ totalQuantity: totalQuantity});
//         return res.json({ status: 404, message: "No se encontró el registro" });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// };

// post /payment por userId Creacion inicial de la cabecera con statusId= 1
// controlar que no se puedan crear mas de una cabecera con statusId= 1
exports.postByUserId = async function (req, res) {
    const { userUid } = req.params;
    try {
        //controlar que no exitan registros con statusId= 1
        const payment = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });
        if (payment)
            return res.json({
                status: 404,
                message: "Ya existe un registro con statusId= 1",
            });
        //si no existe registro con statusId= 1, crearlo
        const newPayment = await Payment.create({
            userUid: userUid,
            totalAmount: 0,
            // methodId: 0,
            transactionId: null,
            deliveryAddress: null,
        });
        if (newPayment) {
            await newPayment.setPayment_status(1);
            // await newPayment.setPayment_method(0)
            return res.status(201).json(newPayment);
        }
        return res.json({
            status: 404,
            message: "No se pudo generar el registro",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// put /payment por userId Actualizacion de la cabecera con todos sus datos //
//OJO ACTUALIZA TODOS LOS REGISTROS, usar solo para limpieza, tal vez tengamos que eliminar este metodo.
exports.putAllByUserId = async function (req, res) {
    const { statusId, totalAmount, methodId, transactionId, deliveryAddress } =
        req.body;
    const { userUid } = req.params;
    try {
        const payment = await Payment.update(
            {
                totalAmount: totalAmount,
                // methodId: methodId,
                transactionId: transactionId,
                deliveryAddress: deliveryAddress,
            },
            {
                where: {
                    userUid: userUid,
                },
            }
        );
        await payment.setPayment_status(statusId);
        await payment.setPayment_method(methodId);
        const updatedPayment = await Payment.findAll({
            where: {
                userUid: userUid,
            },
        });
        if (payment) {
            return res.status(200).json(updatedPayment);
        }
        return res.json({
            status: 404,
            message: "No se pudo actualizar el registro",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// put /payment por id Actualizacion de la cabecera con todos sus datos //
exports.putAllById = async function (req, res) {
    const { statusId, totalAmount, methodId, transactionId, deliveryAddress } =
        req.body;
    const { id } = req.params;
    try {
        const payment = await Payment.update(
            {
                totalAmount: totalAmount,
                // methodId: methodId,
                transactionId: transactionId,
                deliveryAddress: deliveryAddress,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        await payment.setPayment_status(statusId);
        await payment.setPayment_method(methodId);
        const updatedPayment = await Payment.findOne({
            where: {
                id: id,
            },
        });
        if (payment) {
            return res.status(200).json(updatedPayment);
        }
        return res.json({
            status: 404,
            message: "No se pudo actualizar el registro",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//postLocalSorageByUserId. hacer el merge entre el localstorage y la base de datos.
exports.postPaymentPaymentBook = async function (req, res) {
    const { userUid } = req.params;
    //recibir un arreglo por body
    const localStorage = [...req.body] || [];
    try {
        // preguntar si existe un registro con statusId= 1
        const payment = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });
        if (payment) {
            const items = await payment_book.findAll({
                where: {
                    paymentId: payment.id,
                },
            });
            const itemsPaymentBook = items.map((item) => item.dataValues);

            // recorrer el arreglo localStorage y con el id buscar en el arreglo itemsPaymentBook
            // si existe actualizar la cantidad
            // si no existe crear el registro
            for (let i = 0; i < localStorage.length; i++) {
                const element = localStorage[i];
                const item = itemsPaymentBook.find(
                    (item) => item.bookId === element.id
                );
                if (item) {
                    //actualizar
                    const updatedPaymentBook = await payment_book.update(
                        {
                            quantity: element.quantity + item.quantity,
                            price: element.price,
                        },
                        {
                            where: {
                                bookId: item.bookId,
                            },
                        }
                    );
                } else {
                    //crear
                    const newPaymentBook = await payment_book.create({
                        paymentId: payment.id,
                        bookId: element.id,
                        quantity: element.quantity,
                        price: element.price,
                    });
                }
            }
        } else {
            // crear el registro en payment
            const newPayment = await Payment.create({
                userUid: userUid,
                totalAmount: 0,
                // methodId: 0,
                transactionId: null,
                deliveryAddress: null,
            });
            await newPayment.setPayment_status(1);
            // await newPayment.setPayment_method(1) // cambiar
            // recorrer el arreglo localStorage y crear los registros en payment_book
            for (let i = 0; i < localStorage.length; i++) {
                const element = localStorage[i];
                const newPaymentBook = await payment_book.create({
                    paymentId: newPayment.id,
                    bookId: element.id,
                    quantity: element.quantity,
                    price: element.price,
                });
            }
        }
        //obtener el registro de payment para el userUid y statusId=1
        const paymentUpdated = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });

        //obtener el totalAmount, leer de la tabla payment_book para paymentId===payment.id, multiplicar price * quantity y guardarlo en la tabla payment.totalAmount
        const itemsPaymentBook2 = await payment_book.findAll({
            where: {
                paymentId: paymentUpdated.id,
            },
        });
        const totalAmount = itemsPaymentBook2.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const updatedPayment = await Payment.update(
            {
                totalAmount: totalAmount,
            },
            {
                where: {
                    id: paymentUpdated.id,
                },
            }
        );
        const updatedPayment2 = await Payment.findOne({
            where: {
                id: paymentUpdated.id,
            },
        });
        const newItemsPaymentBook2 = itemsPaymentBook2.map(
            (item) => item.dataValues
        );
        return res.status(200).json({
            payment: updatedPayment2,
            payment_book: newItemsPaymentBook2,
            menssage: "Se actualizo el carrito",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

async function recalculatePaymentTotalAmount(paymentId) {
    const itemsPaymentBook2 = await payment_book.findAll({
        where: {
            paymentId: paymentId,
        },
    });
    const totalAmount = itemsPaymentBook2.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const updatedPayment = await Payment.update(
        {
            totalAmount: totalAmount,
        },
        {
            where: {
                id: paymentId,
            },
        }
    );
    const updatedPayment2 = await Payment.findOne({
        where: {
            id: paymentId,
        },
    });
    const newItemsPaymentBook2 = itemsPaymentBook2.map(
        (item) => item.dataValues
    );
    return { payment: updatedPayment2, paymentBook: newItemsPaymentBook2 };
}

// putPaymentPaymentBook. Actualizar la cantidad de un libro en el carrito.
// recibe el paymentId por parametro y bookId, y price y quantity  por body
exports.putPaymentPaymentBook = async function (req, res) {
    const { userUid } = req.params;
    const { id, price, quantity } = req.body;
    try {
        //findond payment by userUid and statusId=1
        const payment = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });

        const paymentBook = await payment_book.findOne({
            where: {
                paymentId: payment.id,
                bookId: id,
            },
        });

        const paymentId = payment.id;
        if (paymentBook) {
            if (quantity === 0) {
                //eliminar el registro
                const deletedPaymentBook = await payment_book.destroy({
                    where: {
                        paymentId: paymentId,
                        bookId: id,
                    },
                });
                //recalcular el totalAmount
                const result = await recalculatePaymentTotalAmount(paymentId);
                return res.status(200).json(result);
            } else {
                const updatedPaymentBook = await payment_book.update(
                    { quantity: quantity, price: price },
                    {
                        where: {
                            paymentId: paymentId,
                            bookId: id,
                        },
                    }
                );
                const { payment, paymentBook } =
                    await recalculatePaymentTotalAmount(paymentId);
                return res.status(200).json({ payment, paymentBook });
            }
        }
        if (!paymentBook) {
            console.log("payment.id", paymentId);
            const newPaymentBook = await payment_book.create({
                paymentId: paymentId,
                bookId: id,
                quantity: quantity,
                price: price,
            });
            const { payment, paymentBook } =
                await recalculatePaymentTotalAmount(paymentId);
            return res.status(201).json({ payment, paymentBook });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// putAddItemToPaymentBook. Adiciona un libro en el carrito.
// recibe el paymentId por parametro y bookId, y price   por body
exports.putAddItemToPaymentBook = async function (req, res) {
    const { userUid } = req.params;
    const { id, price } = req.body;
    try {
        //findond payment by userUid and statusId=1
        const payment = await Payment.findOne({
            where: {
                userUid: userUid,
            },
            include: [
                {
                    model: Payment_status,
                    attributes: ["id", "description"],
                    where: { id: 1 },
                },
            ],
        });

        if (payment) {
            const paymentBook2 = await payment_book.findOne({
                attributes: ["quantity"],
                where: {
                    paymentId: payment.id,
                    bookId: id,
                },
            });

            {
                const paymentId = payment.id;
                if (paymentBook2) {
                    const actualCant = paymentBook2.quantity;
                    const updatedPaymentBook = await payment_book.update(
                        //sumar 1 a quantity
                        { quantity: actualCant + 1, price: price },
                        {
                            where: {
                                paymentId: paymentId,
                                bookId: id,
                            },
                        }
                    );
                    const { payment, paymentBook } =
                        await recalculatePaymentTotalAmount(paymentId);
                    return res.status(200).json({ payment, paymentBook });
                } else {
                    const newPaymentBook = await payment_book.create({
                        paymentId: paymentId,
                        bookId: id,
                        quantity: 1,
                        price: price,
                    });
                    const { payment, paymentBook } =
                        await recalculatePaymentTotalAmount(paymentId);
                    return res.status(201).json({ payment, paymentBook });
                }
            }
        } else {
            // crear el registro en payment
            const newPayment = await Payment.create({
                userUid: userUid,
                totalAmount: 0,
                // methodId: 0,
                transactionId: null,
                deliveryAddress: null,
            });
            await newPayment.setPayment_status(1);
            // await newPayment.setPayment_method(0)
            const paymentId = newPayment.id;
            const newPaymentBook = await payment_book.create({
                paymentId: paymentId,
                bookId: id,
                quantity: 1,
                price: price,
            });
            const { payment, paymentBook } =
                await recalculatePaymentTotalAmount(paymentId);
            return res.status(201).json({ payment, paymentBook });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//putUpdateStatus
exports.putUpdateStatus = async function (req, res) {
    const { paymentId, statusId } = req.params; // paymentId es el id del carrito
    const { transactionId, paymentMethod, deliveryAddress } = req.body
    console.log(req.body)
    try {
        const toUpdate = await Payment.findByPk(paymentId);
        if (toUpdate) {
            await toUpdate.update({ transactionId, deliveryAddress });
            await toUpdate.setPayment_status(statusId);
            // await toUpdate.addPayment_method(paymentMethod);
            await toUpdate.setPayment_method(paymentMethod)
            return res.status(204).json({ menssage: "Se actualizó el status" });
        }
        return res.status(404).json({ menssage: "No se encontró el carrito" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//getPaymentBookById
exports.getPaymentBookById = async function (req, res) {
    const { id } = req.params;
    try {
        const payment = await Payment.findByPk(id, {
            include: [
                { model: Book, attributes: ["id", "title", "image"] },
                { model: Payment_status, attributes: ["id", "description"] },
            ],
        });
        if (payment) return res.status(200).json(payment);
        return res.json({
            status: 404,
            message: "No se encontraron registros",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//getPaymentBookById
exports.getPaymentBookById = async function (req, res) {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                { model: Book, attributes: ["id", "title", "image"] },
                { model: Payment_status, attributes: ["id", "description"] },
            ],
        });
        if (payment) return res.status(200).json(payment);
        return res.json({
            status: 404,
            message: "No se encontraron registros",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.getAllPaymentBookByStatus = async function (req, res) {
    const { statusId } = req.params;
    try {
        const payment = await Payment.findAll({
            order: [["id", "ASC"]],
            include: [
                { model: Book, attributes: ["id", "title", "image"] },
                { model: Payment_status, where: { id: statusId } },
            ],
        });
        // extraer los datos que hay en payment
        const items = payment.map((item) => item.dataValues);
        if (payment) return res.status(200).json(items);
        return res.json({
            status: 404,
            message: "No se encontraron registros",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.getAllPaymentStadistics = async function (req, res) {
    try {
        const payments = await Payment.findAll({
            attributes: [
                "payment_status.description",
                [
                    conn.fn("COUNT", conn.col("payment_status.description")),
                    "TotalCount",
                ],
            ],
            include: [
                {
                    model: Payment_status,
                    attributes: [],
                },
            ],
            group: ["payment_status.description"],
            raw: true,
        });
        return res.json(payments);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
