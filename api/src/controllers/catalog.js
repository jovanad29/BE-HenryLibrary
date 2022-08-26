const axios = require('axios');
const Sequelize = require('sequelize');
const {Book,Category,Author} = require('../db');
const { Op } = require("sequelize");

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll= async function () {
    const catalog = await Book.findAll({
        order: [['title', 'ASC']],
        include: Author, Category
    });
    
    if(catalog.length > 0){

    return catalog;
    }else{
        return undefined;
    }
}

getById = async function (id) {
    const book = await Book.findByPk(id,{
        include: Category,Author
    });
    if(book){
        return book;
    }else{
        return undefined;
    }
}

getBook = async function (title) {  
    const book = await Book.findAll({
        order:[['title', 'ASC']],
        where: {
            title: {
            [Op.iLike]: `%${title}%`,}
        },
        include: Category,Author
    });
    if(book){
        return book;
    }else{
        return undefined;
    }
}


//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
createBook = async function (book) {
    const newBook = await Book.create(book);
    return newBook;
}

//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
updateBook = async function (id, book) {
    const updatedBook = await Book.update(book, {
        where: {
            id: id
        }
    });
    return updatedBook;
}

//----------------------------------------------------------------------------------------------
//    DELETES HACER EL DELETE LOGICO
//----------------------------------------------------------------------------------------------
deleteBook = async function (id) {
    const deletedBook = await Book.destroy({
        where: {
            id: id
        }
    });
    return deletedBook;
}   


module.exports = {  getAll,getBook,getById,createBook,updateBook,deleteBook };

