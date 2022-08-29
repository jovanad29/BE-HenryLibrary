
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
    let dbCategory = await Category.findByPk(id);
    if (dbCategory) {
        dbCategory.name = category;
        await dbCategory.save();
    }
    return dbCategory;
};

//----------- DELETE -----------//
exports.deleteCategory = async function(id) {
    let dbCategory = await Category.findByPk(id);
    if (dbCategory) {
        dbCategory.isActive = false;
        await dbCategory.save();
    }
    return dbCategory;
};
