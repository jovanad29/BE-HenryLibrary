const axios = require("axios");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { Author } = require("../db");


//----------- GET -----------//
exports.getAll = async function() {
    const authors = await Author.findAll({ order: [["name", "ASC"]] });
    return authors.length > 0 ? authors : undefined;
};
exports.getByName = async function(name) {
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
exports.getById = async function(id) {
    const author = await Author.findByPk(id);
    if (author) {
        return author;
    } else {
        return "No se encontro el autor";
    }
};

//----------- POST -----------//
exports.createAuthor = async function(author) {
    const newAuthor = await Author.create(author);
    return newAuthor;
};

//----------- PUT -----------//
exports.updateAuthor = async function(id, author) {
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

//----------- DELETE -----------//
exports.deleteAuthor = async function(id) {
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
