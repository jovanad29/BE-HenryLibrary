
const { Review, User } = require('../db');


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order:[['id']],
            include: {
                model: User, 
                attributes: ['uid',"nameUser","email"],
                through: { attributes: [] }
            }
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

exports.createReview = async function (req, res) {

    const { uid, rating, descrption } = req.body
    //uid -> id del user

    const newReview = await Review.create({
        rating,
        descrption
    })

    try{

        if(uid){ //UN COMENTARIO ES DE UN USUARIO
            const userFind = await User.findOne({
                where:{
                    uid
                   } 
                }) 

            userFind.addReview(newReview) //Aca uno el usuario al review
        }

        return res.status(201).json(newReview);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
} 

//----------- PUT -----------//

exports.editReview = async (req, res) => {

    const { uid, id, rating, descrption } = req.body

    const userUid = await User.findOne({ where:{ uid }})

    try {
        if(userUid){

            await Review.update({
                rating,
                descrption
            }, {where: { id }  }
            );


        } else {
            res.status(404).json({status: 404, message: 'No se encontre el user'});
        }
        return res.status(204).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//----------- DELETE -----------//


exports.deleteReview = async (req, res) => {

    const { id } = req.params;

    try {
        if (id) {

            await Review.destroy({
                    where: { id: id }
                }
            );

            res.json({msg: "Review deleted with exit"});

        } else {
            res.status(404).json({msg:"Not recived id"})
        }
    } catch (error) {
    res.send({msg:"The data cannot be deleted"});
 }
}
    
