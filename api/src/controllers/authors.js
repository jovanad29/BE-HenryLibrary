const axios = require("axios");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { Author } = require("../db");

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll = async function () {
    const authors = await Author.findAll({ order: [["name", "ASC"]] });
    return authors.length > 0 ? authors : undefined;
};

getByName = async function (name) {
    const authors = await Author.findAll({
        order: [["name", "ASC"]],
        where: {
            name: {
                [Op.iLike]: `%${name}%`,
            },
        },
    });
    return authors.length > 0 ? authors : undefined;
};

getById = async function (id) {
    const author = await Author.findByPk(id);
    if (author) {
        return author;
    } else {
        return "No se encontro el autor";
    }
};
//----------------------------------------------------------------------------------------------
//    POSTS
//----------------------------------------------------------------------------------------------
createAuthor = async function (author) {
    const newAuthor = await Author.create(author);
    return newAuthor;
};
//----------------------------------------------------------------------------------------------
//    PUTS
//----------------------------------------------------------------------------------------------
updateAuthor = async function (id, author) {
    const updatedAuthor = await Author.update(author, {
        where: {
            id: id,
        },
    });
    if (updatedAuthor) {
        return updatedAuthor;
    } else {
        return "No se encontro el autor";
    }
};
//----------------------------------------------------------------------------------------------
//    DELETES HACER EL DELETE LOGICO
//----------------------------------------------------------------------------------------------
deleteAuthor = async function (id) {
    const deletedAuthor = await Author.destroy({
        where: {
            id: id,
        },
    });
    if (deletedAuthor) {
        return deletedAuthor;
    } else {
        return "No se encontro el autor";
    }
};
module.exports = {
    getAll,
    getByName,
    getById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};
