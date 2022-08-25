
require('dotenv').config();
const { Sequelize, FLOAT } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  port: DB_PORT,
  define: {
    freezeTableName: true,  // Mantiene los nombres definidos en los modelos (no los cambia a plural)
    // timestamps: false    // Comentar si se quieren crear los campos createdAt y updatedAt de forma predeterminada en todas las tablas
  }
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Apibook,
  Book, 
  Category, 
  Author,
  User,
  Publisher ,
  Payment,
  Payment_method,
  Review,

} = sequelize.models;

// Aca vendrian las relaciones
Book.belongsToMany(Author,{through: "book_author"});
Author.belongsToMany(Book,{through: "book_author"});

// Book.belongsToMany(Category,{through: "book_category"});
// Category.belongsToMany(Book,{through: "book_category"});
// Publisher.hasMany(Book);


// payment_book = sequelize.define("payment_book", {
//   quantity: Sequelize.INTEGER,
//   price:sequelize.Sequelize.FLOAT
// });
// Payment.belongsToMany(Book,{through: "payment_book"});
// Book.belongsToMany(Payment,{through: "payment_book"});

// User.hasMany(Payment);
// Payment_method.hasMany(Payment);
// User.belongsToMany(Review,{through:"review_user"})
// Review.belongsToMany(User,{through:"review_user"})
// Review.belongsToMany(Book,{through:"review_book"})
// Book.belongsToMany(Review,{through:"review_book"})

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
