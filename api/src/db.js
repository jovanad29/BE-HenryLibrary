
require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');


const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
// const { DATABASE_URL } = process.env
const sequelize = new Sequelize(`postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`, {
// const sequelize = new Sequelize(`${DATABASE_URL}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  port: PGPORT,
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
  Book, 
  Category, 
  Author,
  User,
  Publisher ,
  Payment,
  Payment_method,
  Payment_mp,
  Payment_status,
  Review,
  Order_status
} = sequelize.models;

// Aca vendrían las relaciones
Book.belongsToMany(Author, {
  through: 'book_author',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Author.belongsToMany(Book, {
  through: 'book_author',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Book.belongsToMany(Category, {
  through: 'book_category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Category.belongsToMany(Book, {
  through: 'book_category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Publisher.hasMany(Book, {
  foreignKey: 'bookId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Book.belongsTo(Publisher, {
  foreignKey: 'bookId',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
payment_book = sequelize.define('payment_book', {
  quantity: Sequelize.INTEGER,
  price: sequelize.Sequelize.FLOAT
});
Payment.belongsToMany(Book,{through: 'payment_book'});
Book.belongsToMany(Payment,{through: 'payment_book'});
Payment_status.hasMany(Payment, {
  foreignKey: 'statusId',
  onUpdate: 'CASCADE',
});
Payment.belongsTo(Payment_status, {
  foreignKey: 'statusId',
  onUpdate: 'CASCADE',
});
// MERCADOPAGO
payment_mp_book = sequelize.define('payment_mp_book', {
  quantity: Sequelize.INTEGER,
  price: sequelize.Sequelize.FLOAT
});
Payment_mp.belongsToMany(Book,{through: 'payment_mp_book', foreignKey: 'paymentMpId'});
Book.belongsToMany(Payment_mp,{through: 'payment_mp_book', foreignKey: 'bookId'});
User.hasMany(Payment_mp, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
});
Payment_mp.belongsTo(User, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
});
Payment_method.hasMany(Payment_mp, {
  foreignKey: 'paymentMethodId',
  onUpdate: 'CASCADE',
});
Payment_mp.belongsTo(Payment_method, {
  foreignKey: 'paymentMethodId',
  onUpdate: 'CASCADE',
});
Payment_status.hasMany(Payment_mp, {
  foreignKey: 'statusId',
  targetKey: 'id',
  onUpdate: 'CASCADE',
});
Payment_mp.belongsTo(Payment_status, {
  foreignKey: 'statusId',
  targetKey: 'id',
  onUpdate: 'CASCADE',
});
Order_status.hasOne(Payment_mp, {
  foreignKey: 'orderStatusId',
  targetKey: 'id',
  onUpdate: 'CASCADE',
})
Payment_mp.belongsTo(Order_status, {
  foreignKey: 'orderStatusId',
  targetKey: 'id',
  onUpdate: 'CASCADE',
})
// MERCADOPAGO
User.hasMany(Payment);
Payment_method.hasMany(Payment);
Payment.belongsTo(Payment_method)
User.belongsToMany(Review,{through:'review_user'})
Review.belongsToMany(User,{through:'review_user'})
Review.belongsToMany(Book,{through:'review_book'})
Book.belongsToMany(Review,{through:'review_book'})
User.belongsToMany(Book, {through:'user_favorites'})
Book.belongsToMany(User, {through:'user_favorites'})

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
