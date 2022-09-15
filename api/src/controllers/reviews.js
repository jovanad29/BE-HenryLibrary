
const { Review, User, Book } = require('../db');


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order:[['id']],
            include: [{
                model: User, 
                attributes: ['uid',"nameUser","email"],
                through: { attributes: [] }
            },            {
                model: Book, 
                attributes: ['id'],
                through: { attributes: [] }
            }]
        });
        // const orderReviews = reviews.map(review => review.toJSON());
        if (reviews) return res.json(reviews)
        return res.status(404).json({status: 404, message: 'No se encontraron reviews'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

//----------- GET -----------//
exports.getAllReviewByUser = async (req, res) => {
    const {uid} = req.query
    try {
        const reviews = await Review.findAll({
            include: [{
                model: User, 
                attributes: ['uid',"nameUser","email"],
                through: { attributes: [] },
                where:{
                    uid : uid
                }
            },            {
                model: Book, 
                attributes: ['id', "title"],
                through: { attributes: [] }
            }]
        });
        // const orderReviews = reviews.map(review => review.toJSON());
        if (reviews) return res.json(reviews)
        return res.status(404).json({status: 404, message: 'No se encontraron reviews'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}


exports.getAllReviewsByBook = async (req, res) => {
    const { id } = req.params;    
    try {
        const reviews = await Review.findAll({
            order:[['id']],
            include: 
            [
                {
                    model: User, 
                    attributes: ['uid',"nameUser","email"],
                    through: { attributes: [] }
                },
                {
                    model: Book, 
                    attributes: ['id'],
                    through: { attributes: [] },
                    where:{
                      id: id // Aca filtro mediante "id" solo los reviews de determinado libro
                    }
                }
           ],
        });
        if (reviews) {
            return res.json(reviews)
        }
        return res.status(404).json({status: 404, message: 'No se encontraron reviews'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
  }
  

//----------- POST -----------//


exports.createReviewByBook = async function (req, res) {

    const { uid, rating, descrption } = req.body
    //uid -> id del user

    const {id} = req.params
    // id -> id del libro en específico

    try{
 
        const newReview = await Review.create({
            rating,
            descrption,
        })


        if(uid){ //UN COMENTARIO ES DE UN USUARIO
            const userFind = await User.findOne({
                where:{
                    uid
                   } 
                }) 

            userFind.addReview(newReview) //Aca uno el usuario al review
            
        }

        if(id){
            const libroFind = await Book.findOne({
                where:{
                    id
                   }
                // ,include: {attributes: ['title']},
            })

                libroFind.addReview(newReview) //Aca uno el libro al review
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
    
