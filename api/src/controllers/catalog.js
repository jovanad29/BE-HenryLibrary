const axios = require('axios');
const Sequelize = require('sequelize');
const {Book,Category,Author} = require('../db');

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll= async function () {
    const catalog = await Book.findAll({
        include: Category,Author
    });
    const catalogJson = catalog.map(book => book.toJSON());
    const alphabeticalCatalog = catalogJson.sort((a, b) => a.title.localeCompare(b.title));

    if(alphabeticalCatalog.length > 0){

    return alphabeticalCatalog;
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
        return "No se encontro el libro";
    }
}

getBook = async function (title) {  
    const book = await Book.findOne({
        where: {
            title: title
        },
        include: Category,Author
    });
    if(book){
        return book;
    }else{
        return "No se encontro el libro";
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

