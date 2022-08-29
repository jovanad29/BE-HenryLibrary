
const { Review } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    const reviews = await Review.findAll({
        order:[['id']],
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
