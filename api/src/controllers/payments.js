const { Payment} = require('../db');
const { Op } = require('sequelize');

// get payment por userId con stausId=1.
exports.getByUserIdStatus1 = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.findOne({
        where: {
            userUid: userUid,
            statusId: 1,
        },
        });
        if (payment) return res.status(200).json(payment);
        return res.json({ status: 404, message: "No se encontró el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// get all paymet por userId
exports.getAllByUserId = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.findAll({
        where: {
            userUid: userUid,
        },
        });
        if (payment) return res.status(200).json(payment);
        return res.json({ status: 404, message: "No se encontraron registros" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};


// post /payment por userId Creacion inicial de la cabecera con statusId= 1
// controlar que no se puedan crear mas de una cabecera con statusId= 1
exports.postByUserId = async function (req, res) {
    const { userUid } = req.params;
    try {
        //controlar que no exitan registros con statusId= 1
        const payment = await Payment.findOne({
        where: {
            userUid: userUid,
            statusId: 1,
        },
        });
        if (payment) return res.json({ status: 404, message: "Ya existe un registro con statusId= 1" });
        //si no existe registro con statusId= 1, crearlo
        const newPayment = await Payment.create({
        userUid: userUid,
        statusId: 1,
        totalAmount: 0,
        methodId: 0,
        transactionId: null,
        deliveryAddress: null
        });
        if (newPayment) return res.status(200).json(newPayment);
        return res.json({ status: 404, message: "No se pudo generar el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// put /payment por userId Actualizacion de la cabecera con todos sus datos //
//OJO ACTUALIZA TODOS LOS REGISTROS, usar solo para limpieza, tal vez tengamos que eliminar este metodo.
exports.putAllByUserId = async function (req, res) {
    const { statusId, totalAmount, methodId, transactionId ,deliveryAddress} = req.body;
    const { userUid } = req.params;
    try {
        const payment = await Payment.update(
        {
            
            statusId: statusId,
            totalAmount: totalAmount,
            methodId: methodId,
            transactionId: transactionId,
            deliveryAddress: deliveryAddress
        },
        {
            where: {
            userUid: userUid,
            },
        }
        );
        const updatedPayment = await Payment.findAll({
        where: {
            userUid: userUid,
        },
        });
        if (payment) return res.status(200).json(updatedPayment);
        return res.json({ status: 404, message: "No se pudo actualizar el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// put /payment por id Actualizacion de la cabecera con todos sus datos //
exports.putAllById = async function (req, res) {
    const { statusId, totalAmount, methodId, transactionId ,deliveryAddress} = req.body;
    const { id } = req.params;
    try {
        const payment = await Payment.update(
        {
            statusId: statusId,
            totalAmount: totalAmount,
            methodId: methodId,
            transactionId: transactionId,
            deliveryAddress: deliveryAddress
        },
        {
            where: {
            id: id,
            },
        }
        );
        const updatedPayment = await Payment.findOne({
        where: {
            id: id,
        },
        });
        if (payment) return res.status(200).json(updatedPayment);
        return res.json({ status: 404, message: "No se pudo actualizar el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
