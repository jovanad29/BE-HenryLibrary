const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'payment_mp',
		{
            transaction_id: {    // mpID
                type: DataTypes.STRING,
				allowNull: false,
				primaryKey:true,
            },
            payment_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            payment_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            delivery_address: {
                type: DataTypes.STRING,
                allowNull: false
            }
		}
	);
};
