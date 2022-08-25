const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'payment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transactionId:{ 
        type: DataTypes.INTEGER,
        allowNull:true,

      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
    },
    {
      timestamps: false
    }
  );
};
