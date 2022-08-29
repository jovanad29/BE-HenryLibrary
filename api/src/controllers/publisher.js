const{Publisher} = require('../db');

//----------------------------------------------------------------------------------------------
//    GETS
//----------------------------------------------------------------------------------------------
getAll = async function (id) {
    // buscar un publisher por su id
    const publishers = await Publisher.findAll({
        order:[["name"]],
    }) ;
    // si el publisher existe, se retorna el publisher
    return publishers.length > 0 ? publishers : undefined; 
}

getById = async function (id) {
    // buscar un publisher por su id
    const publisher = await Publisher.findByPk(id) ;
    // si el publisher existe, se retorna el publisher
    return publisher ? publisher : undefined; 
}

module.exports = {getAll, getById};

