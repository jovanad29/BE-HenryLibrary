const axios = require('axios');
const Sequelize = require('sequelize');
const {Category} = require('../db');

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll= async function () {
    const categories = await Category.findAll({order: [['name', 'ASC']]});
    return categories.length > 0 ? categories : undefined;
}


getById = async function (id) {
    const category = await Category.findByPk(id);
    if(category){
        return category;
    }else{
        return "No se encontro la categoria";
    }
}

//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
createCategory = async function (category) {
    const newCategory = await Category.create(category);
    return newCategory;
}
//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
updateCategory = async function (id, category) {
    const updatedCategory = await Category.update(category, {
        where: {
            id: id
        }
    });
    if(updatedCategory){
        return updatedCategory;
    }else{
        return "No se encontro la categoria";
    }
}
//----------------------------------------------------------------------------------------------
//    DELETES HACER EL DELETE LOGICO
//----------------------------------------------------------------------------------------------
deleteCategory = async function (id) {
    const deletedCategory = await Category.destroy({
        where: {
            id: id
        }
    });
    if(deletedCategory){
        return deletedCategory;
    }else{
        return "No se encontro la categoria";
    }
}
module.exports = {getAll, getById,createCategory,updateCategory,deleteCategory};
