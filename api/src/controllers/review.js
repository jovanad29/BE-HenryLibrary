const axios = require('axios');
const Sequelize = require('sequelize');
const {Review} = require('../db');


//----------- GET -----------//
getAll = async function () {
    const reviews = await Review.findAll({
        order:[["ID"]],
    });
    const orderReviews = reviews.map(review => review.toJSON());
    
    if(orderReviews.length > 0){

    return orderReviews;
    }else{
        return undefined;
    }
}

//----------- POST -----------//


//----------- PUT -----------//


//----------- DELETE -----------//

module.exports = {getAll};