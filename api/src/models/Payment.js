const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'payment',
		{
			transactionId: { 
				type: DataTypes.INTEGER,
				allowNull:true,
			},

			userUid: {
				type: DataTypes.STRING,
				allowNull: false,
			},			
			// methodId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// },
			totalAmount: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			// statusId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// },
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
