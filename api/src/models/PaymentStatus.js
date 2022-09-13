const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'payment_status',
		{
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
		}
	);
};
