const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'user',
		{
			uid: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey:true,
			},
			nameUser: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [1,100],
			},
			},
			// lastname: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// 	validate: {
			// 		len: [1,100],
			// 	},
			// },
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate:{
					is:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
				},
				
			},
			// password: {
			// 	type: DataTypes.STRING,
			// 	allowNull: true,
			// 	validate: {
			// 		len: [4,100],
			// 	},
			// },
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue:true,
			},
			profilePic: {
				type: DataTypes.STRING,
				allowNull: true,// front debera permitir que si no hay avatar o imagen de un icono no identificado
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue:false,
			},			
			address: {
				type: DataTypes.STRING,
				allowNull: true,
			}, 
			isBanned: {
				type: DataTypes.BOOLEAN,
				defaultValue:false,
			}
		}
	);
};


