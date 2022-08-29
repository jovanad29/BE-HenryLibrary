const axios = require("axios");
const Sequelize = require("sequelize");
const { Category } = require("../db");


//----------- GET -----------//
getAll = async function () {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    return categories.length > 0 ? categories : undefined;
};
getById = async function (id) {
    const category = await Category.findByPk(id);
    return category;
};

//----------- POST -----------//
createCategory = async function (category) {
    const newCategory = await Category.create({ name: category });
    return newCategory;
};

//----------- PUT -----------//
updateCategory = async function (id, category) {
    let dbcategory = await Category.findByPk(id);
    if (dbcategory) {
        dbcategory.name = category;
        await dbcategory.save();
    }
    return dbcategory;
};

//----------- DELETE -----------//
deleteCategory = async function (id) {
    let dbcategory = await Category.findByPk(id);
    if (dbcategory) {
        dbcategory.isDeleted = true;
        await dbcategory.save();
    }
    return dbcategory;
};

module.exports = {
    getAll,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
};
