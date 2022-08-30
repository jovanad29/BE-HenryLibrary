const { Publisher } = require('../db');


//----------- GET -----------//
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
exports.getById = async function (req, res) {
    const { id } = req.params;
    try {
        const publisher = await Publisher.findByPk(id) ;        
        return publisher ? 
            res.json(publisher) :
            res.status(404).json({status: 404, message: 'No se encontró la editorial'}) 
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
