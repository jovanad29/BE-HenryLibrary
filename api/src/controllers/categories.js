
const { Category, Book, Author, Publisher, conn } = require('../db');
const { QueryTypes } = require('sequelize')


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        if (categories) return res.json(categories)
        return res.status(404).json({status: 404, message: 'No se encontraron la categorías'})   
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) return res.json(category)
        return res.status(404).json({status: 404, message: 'No se encontró la categoría'})      
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.getBooksByCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include : {
                model: Book,
                include: [Author, Publisher]
            }
        });
        if (category) {
            return res.json(category);
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró la categoría'});
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
//----------- POST -----------//
exports.createCategory = async (req, res) => {
    const { name } = req.body
    try {
        //busca la categoria y si no la encuentra la crea
        let [category, created] = await Category.findOrCreate({
            where: { name },
            defaults: { name }
        });
        if (created) {
            return res.status(201).json(category);
        } else {
            return res.status(400).json({status: 400, message: 'La categoría ya existe'});
        }                
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

//----------- PUT -----------//
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        let dbCategory = await Category.findByPk(id);
        if (dbCategory) {
            dbCategory.name = name;
            await dbCategory.save();
        }
        return res.status(204).json({})        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

//----------- DELETE -----------//
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id, {
            include : {
                model: Book,
                include: [Author, Publisher]
            }});
        //hago delete de category por id, si que no tiene libros asociados
        if (category.dataValues.books.length === 0) {
            await category.destroy();
            return res.status(204).json({})
        } else {
            return res.status(404).json({status: 404, message: 'No se puede eliminar el género porque tiene libros asociados'})
        }
      
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.bestSellerCategories = async (req, res) => {
    // try {                                         // FUNCIONA PERO EL ORDEN NO ES CORRECTO
    //     const categories = await Category.findAll({
    //         include: [{model: Book, attributes: ['id', 'title', 'soldCopies']}],
    //         order: [[Book, 'soldCopies', 'DESC']]
    //     })
    //     return res.json(categories)     
    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).json(error)
    // }
    try {
        const categories = await conn.query('SELECT sum("book"."soldCopies") AS "soldCopies", "category"."id", "category"."name" FROM book INNER JOIN book_category ON "book_category"."bookId"="book"."id" INNER JOIN category ON "book_category"."categoryId"="category"."id" GROUP BY "category"."id" ORDER BY "soldCopies" DESC', { type: QueryTypes.SELECT })
        return res.json(categories)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
