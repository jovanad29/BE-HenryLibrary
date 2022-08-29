
const { Category } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        return categories
    } catch (error) {
        console.log(error)
        return undefined
    }
};
exports.getById = async function (id) {
    try {
        const category = await Category.findByPk(id);
        return category;        
    } catch (error) {
        console.log(error)
        return undefined
    }
};

//----------- POST -----------//
exports.createCategory = async function(category) {
    try {
        const newCategory = await Category.create({ name: category });
        return newCategory;        
    } catch (error) {
        console.log(error)
    }
};

//----------- PUT -----------//
exports.updateCategory = async function(id, category) {
    try {
        let dbCategory = await Category.findByPk(id);
        if (dbCategory) {
            dbCategory.name = category;
            await dbCategory.save();
        }
        return dbCategory;        
    } catch (error) {
        console.log(error)
    }
};

//----------- DELETE -----------//
exports.deleteCategory = async function(id) {
    try {
        let dbCategory = await Category.findByPk(id);
        if (dbCategory) {
            dbCategory.isActive = false;
            await dbCategory.save();
        }
        return dbCategory;        
    } catch (error) {
        console.log(error)
    }
};
