const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'payment_mp',
		{
            transactionId: {    // mpID
                type: DataTypes.STRING,
				allowNull: false,
            },
            paymentType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            statusDetail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            deliveryAddress: {
                type: DataTypes.STRING,
                allowNull: false
            }
		}
	);
};
