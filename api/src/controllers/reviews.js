
const { Review } = require('../db');


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order:[['id']],
        });
        // const orderReviews = reviews.map(review => review.toJSON());
        if (reviews) return res.json(reviews)
        return res.status(404).json({status: 404, message: 'No se encontraron reviews'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

//----------- POST -----------//


//----------- PUT -----------//


//----------- DELETE -----------//
