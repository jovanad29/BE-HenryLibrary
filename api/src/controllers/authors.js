
const { Op } = require('sequelize');
const { Author } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    try {
        const authors = await Author.findAll({ order: [['name', 'ASC']] });
        return authors
    } catch (error) {
        console.log(error)
        return undefined
    }
};
exports.getByName = async function(name) {
    try {
        const authors = await Author.findAll({
            order: [['name', 'ASC']],
            where: {
                name: {
                    [Op.iLike]: `%${name}%`,
                },
            },
        });
        return authors
    } catch (error) {
        console.log(error)
        return undefined
    }
};
exports.getById = async function(id) {
    try {
        const author = await Author.findByPk(id);
        if (author) {
            return author;
        } else {
            return 'No se encontró el autor';
        }        
    } catch (error) {
        console.log(error)
    }
};

//----------- POST -----------//
exports.createAuthor = async function(author) {
    try {
        const newAuthor = await Author.create(author);
        return newAuthor;        
    } catch (error) {
        console.log(error)
    }
};

//----------- PUT -----------//
exports.updateAuthor = async function(id, author) {
    try {
        const updatedAuthor = await Author.update(author, {
            where: {
                id: id,
            },
        });
        if (updatedAuthor) {
            return updatedAuthor;
        } else {
            return 'No se encontró el autor';
        }        
    } catch (error) {
        console.log(error)
    }
};

//----------- DELETE -----------//
exports.deleteAuthor = async function(id) {
    try {
        const deletedAuthor = await Author.destroy({
            where: {
                id: id,
            },
        });
        if (deletedAuthor) {
            return deletedAuthor;
        } else {
            return 'No se encontró el autor';
        }        
    } catch (error) {
        console.log(error)
    }
};
