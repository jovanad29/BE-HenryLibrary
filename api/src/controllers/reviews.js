
const { Review } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    try {
        const reviews = await Review.findAll({
            order:[['id']],
        });
        const orderReviews = reviews.map(review => review.toJSON());
        return orderReviews;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}

//----------- POST -----------//


//----------- PUT -----------//


//----------- DELETE -----------//
