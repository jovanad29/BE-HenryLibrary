const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'book',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
     idPublisher: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      publishedDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
     
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industryIdentifiers: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      soldCopies: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull: true,
      },
      currentStock: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
      },
      active: {
        type:  DataTypes.BOOLEAN,

      }
    });
};


