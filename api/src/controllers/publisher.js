const { Publisher } = require('../db');

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
exports.getAll = async function (req, res) {
    try {
        const publishers = await Publisher.findAll({
            order:[["name"]],
        })
        return res.json(publishers)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.getById = async function (id) {
    // buscar un publisher por su id
    const publisher = await Publisher.findByPk(id) ;
    // si el publisher existe, se retorna el publisher
    return publisher ? publisher : undefined; 
}

