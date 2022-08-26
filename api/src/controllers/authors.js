const axios = require('axios');
const Sequelize = require('sequelize');
const {Author} = require('../db');

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll= async function () {
    const authors = await Author.findAll();
    const authorsJson = authors.map(author => author.toJSON());
    const alphabeticalAuthors = authorsJson.sort((a, b) => a.name.localeCompare(b.name));

    if(alphabeticalAuthors.length > 0){

    return alphabeticalAuthors;
    }else{
        return undefined;
    }
}
getById = async function (id) {
    const author = await Author.findByPk(id);
    if(author){
        return author;
    }else{
        return "No se encontro el autor";
    }
}
//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
createAuthor = async function (author) {
    const newAuthor = await Author.create(author);
    return newAuthor;
}
//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
updateAuthor = async function (id, author) {
    const updatedAuthor = await Author.update(author, {
        where: {
            id: id
        }
    });
    if(updatedAuthor){
        return updatedAuthor;
    }else{
        return "No se encontro el autor";
    }
}
//----------------------------------------------------------------------------------------------
//    DELETES HACER EL DELETE LOGICO
//----------------------------------------------------------------------------------------------
deleteAuthor = async function (id) {
    const deletedAuthor = await Author.destroy({
        where: {
            id: id
        }
    });
    if(deletedAuthor){
        return deletedAuthor;
    }else{
        return "No se encontro el autor";
    }
}
module.exports = {getAll,getById,createAuthor,updateAuthor,deleteAuthor};
