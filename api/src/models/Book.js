const { DataTypes } = require('sequelize');
// const patternText = new RegExp("^[A-Z]+$", "i");
//   const patternURL = new RegExp(
//     /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi
//   );
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
	sequelize.define(
		'book', {
			title: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					len: [1,300],
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					len: [1,5200],
				},
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			image: {
				type: DataTypes.TEXT,
				allowNull: true,
				validate:{
					is:/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi  
				},
			},
			publisherId: {
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
				validate:{
					isInt: true,
					min: 0
				},
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
			isActive: {
				type:  DataTypes.BOOLEAN,
				defaultValue:true,
			},
			// isBanned: {
			//   type:  DataTypes.BOOLEAN,
			//   defaultValue:false,
			// }
		});
};


