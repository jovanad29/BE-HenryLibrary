const { Payment} = require('../db');
const { Op } = require('sequelize');

exports.getByUserIdStatusId = async function (req, res) {
    const { userUid, statusId } = req.params;
    try {
        const payment = await Payment.findOne({
        where: {
            userUid: userUid,
            statusId: statusId,
        },
        });
        if (payment) return res.status(200).json(payment);
        return res.json({ status: 404, message: "No se encontró el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
    };

// post /payment por userId 
exports.postByUserId = async function (req, res) {
    const { userUid } = req.params;
    try {
        const payment = await Payment.create({
        userUid: userUid,
        statusId: 1,
        totalAmount: 0,
        methodId: 0,
        transactionId: null,
        deliveryAddress: null
        });
        if (payment) return res.status(200).json(payment);
        return res.json({ status: 404, message: "No se pudo generar el registro" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
    }