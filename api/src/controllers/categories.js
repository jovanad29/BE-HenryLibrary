const axios = require('axios');
const Sequelize = require('sequelize');
const { Category } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return categories.length > 0 ? categories : undefined;
};
exports.getById = async function (id) {
    const category = await Category.findByPk(id);
    return category;
};

//----------- POST -----------//
exports.createCategory = async function(category) {
    const newCategory = await Category.create({ name: category });
    return newCategory;
};

//----------- PUT -----------//
exports.updateCategory = async function(id, category) {
    let dbcategory = await Category.findByPk(id);
    if (dbcategory) {
        dbcategory.name = category;
        await dbcategory.save();
    }
    return dbcategory;
};

//----------- DELETE -----------//
exports.deleteCategory = async function(id) {
    let dbcategory = await Category.findByPk(id);
    if (dbcategory) {
        dbcategory.isActive = false;
        await dbcategory.save();
    }
    return dbcategory;
};
