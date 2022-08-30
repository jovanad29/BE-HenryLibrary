
const { Op } = require('sequelize');
const { Author, Book, Category, Publisher } = require('../db');


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
exports.getById = async function(req, res) {
    try {
        const author = await Author.findByPk(req.params.id);
        if (author) {
            return res.json(author);
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró el autor'});
        }        
    } catch (error) {
        console.log(error)
    }
};
exports.getBooksByAuthor = async function(req, res) {
    try {
        const author = await Author.findByPk(req.params.id, {
            include: {
                model: Book,
                include: [Category, Publisher]
            }
        });
        if (author) {
            return res.json(author);
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró el autor'});
        }        
    } catch (error) {
        console.log(error)
    }
};

//----------- POST -----------//
exports.createAuthor = async function(req,res) {
    const author = req.body
    try {
        const newAuthor = await Author.create(author);
        return res.status(201).json(newAuthor);        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);  
    }
};

//----------- PUT -----------//
exports.updateAuthor = async function(req, res) {
    const { id } = req.params
    const { name } = req.body
    console.log(id, name)
    try {
        const updatedAuthor = await Author.update({name: name}, {
            where: {
                id: id,
            },
        });
        if (updatedAuthor) {
            return res.status(204).json({});
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró el autor'});
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);  
    }
};

//----------- DELETE -----------//
exports.deleteAuthor = async function(req, res) {
    try {
        const deletedAuthor = await Author.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (deletedAuthor) {
            return res.status(204).json({});
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró el autor'});
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);  
    }
};
