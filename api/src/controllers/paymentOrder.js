const { PaymentsOrder, User, Book
 // Category 
} = require('../db');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

let paymentsModel = {
  createPayments: async function (payment) {
    try {
      console.log("Estoy en el controlador 'createPayments' imprimiendo el param recibido: ", payment)
      const createPayment = await PaymentsOrder.create({
        mpID: payment.ID,
        items: payment.items,
        total: payment.total,
        userID: payment.userID,
        status: payment.status,
      });
      const categoriesArray = await createPayment.toJSON().items;
      console.log("estoy imprimiendo createPayment en el controlador createPayments: ", createPayment)
      console.log("estoy imprimiendo categoriesArray en el controlador createPayments: ", categoriesArray)
      for (let i = 0; i < categoriesArray.length; i++) {
        const ID = await createPayment.toJSON().items[i].ID;
        const book = await Book.findByPk(ID);
        const bookJSON = book.toJSON();
  
        await book.update({
          soldCopies: bookJSON.soldCopies + 1, // y si compré el mismo libro más de una vez?
        });
  
      // cargar las copias vendidas por CATEGORIA podriamos hacerlo !!!  
      // const cat = await Category.findOne({
      //     where: {
      //       category: { [Op.iLike]: bookJSON.categories[0] },
      //     },
      //   });
  
      //   let soldCopy = 0;
      //   if (cat) {
      //     soldCopy = cat.toJSON().soldCopies;
      //     await cat.update({
      //       soldCopies: soldCopy + 1,
      //     });
      //   }
      } // fin del for
      console.log(createPayment)
      return createPayment;
    } catch (error) {
      console.log(error)
    }
  },

  getPayments: async function () {
    const payments = await PaymentsOrder.findAll({
      include: {
        model: User,
        
      },
    });
    return payments;
  },

  getPaymentByID: async function (ID, token) {
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
  },
};

module.exports = paymentsModel;
